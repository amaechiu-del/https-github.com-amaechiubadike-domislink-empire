#!/bin/bash

# Create a Kubernetes manifest for a service
create_k8s_manifest() {
    local service_name=$1
    local port=$2
    local replicas=${3:-2}
    
    cat > ${service_name}-deployment.yaml << MANIFEST
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service_name}
  labels:
    app: ${service_name}
    tier: $(if [[ $port -ge 4000 ]]; then echo "backend"; else echo "frontend"; fi)
spec:
  replicas: ${replicas}
  selector:
    matchLabels:
      app: ${service_name}
  template:
    metadata:
      labels:
        app: ${service_name}
    spec:
      containers:
      - name: ${service_name}
        image: ghcr.io/amaechiu-del/domislink-${service_name}:latest
        ports:
        - containerPort: ${port}
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "${port}"
        envFrom:
        - configMapRef:
            name: ${service_name}-config
        - secretRef:
            name: ${service_name}-secrets
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: ${port}
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: ${port}
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ${service_name}
  labels:
    app: ${service_name}
spec:
  type: ClusterIP
  ports:
  - port: ${port}
    targetPort: ${port}
    protocol: TCP
  selector:
    app: ${service_name}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${service_name}-config
data:
  LOG_LEVEL: "info"
---
apiVersion: v1
kind: Secret
metadata:
  name: ${service_name}-secrets
type: Opaque
stringData:
  # Add secrets here
  DATABASE_URL: ""
MANIFEST
    
    echo "Created ${service_name}-deployment.yaml"
}

# Create manifests for all services
create_k8s_manifest "hub" "3000" "3"
create_k8s_manifest "realestate" "3001" "2"
create_k8s_manifest "tickets" "3002" "2"
create_k8s_manifest "flightmonitor" "3003" "2"
create_k8s_manifest "teachmaster" "3004" "2"
create_k8s_manifest "admin" "3005" "2"
create_k8s_manifest "auth-service" "4000" "3"
create_k8s_manifest "payments-service" "4001" "2"
create_k8s_manifest "geolocation-service" "4002" "2"
create_k8s_manifest "notification-service" "4003" "2"
create_k8s_manifest "gateway" "8080" "3"

echo "All Kubernetes manifests created!"
