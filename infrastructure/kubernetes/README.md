# Kubernetes Deployment Guide

## Prerequisites

- Kubernetes cluster (EKS, GKE, AKS, or local with Minikube)
- kubectl configured
- Nginx Ingress Controller installed
- cert-manager installed (for TLS)

## Quick Deploy

### 1. Apply All Manifests

```bash
kubectl apply -f infrastructure/kubernetes/
```

### 2. Verify Deployments

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check ingress
kubectl get ingress
```

### 3. Configure Secrets

```bash
# Create namespace
kubectl create namespace domislink

# Create secrets for each service
kubectl create secret generic auth-service-secrets \
  --from-literal=JWT_SECRET=your-secret-key \
  --from-literal=DATABASE_URL=postgresql://... \
  -n domislink

# Repeat for other services...
```

## Individual Service Deployment

### Deploy Single Service

```bash
kubectl apply -f infrastructure/kubernetes/auth-service-deployment.yaml
```

### Scale Service

```bash
kubectl scale deployment auth-service --replicas=5
```

### Update Service

```bash
kubectl set image deployment/auth-service \
  auth-service=ghcr.io/amaechiu-del/domislink-auth-service:v1.2.0
```

## Monitoring

### View Logs

```bash
# All pods
kubectl logs -l app=auth-service

# Specific pod
kubectl logs auth-service-xxxxx-yyyyy

# Follow logs
kubectl logs -f auth-service-xxxxx-yyyyy
```

### Check Health

```bash
# Port forward to local
kubectl port-forward svc/gateway 8080:8080

# Check health
curl http://localhost:8080/health
```

## Horizontal Pod Autoscaling

### Create HPA

```bash
kubectl autoscale deployment auth-service \
  --cpu-percent=70 \
  --min=2 \
  --max=10
```

### Check HPA Status

```bash
kubectl get hpa
```

## Troubleshooting

### Pod Not Starting

```bash
# Describe pod
kubectl describe pod auth-service-xxxxx

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

### Service Unreachable

```bash
# Check endpoints
kubectl get endpoints auth-service

# Test service connectivity
kubectl run -it --rm debug --image=curlimages/curl --restart=Never -- \
  curl http://auth-service:4000/api/health
```

### View Resource Usage

```bash
kubectl top pods
kubectl top nodes
```

## Cleanup

```bash
# Delete all resources
kubectl delete -f infrastructure/kubernetes/

# Delete namespace
kubectl delete namespace domislink
```

## Production Considerations

1. **Use Namespaces**: Deploy to separate namespace
2. **Resource Limits**: Set appropriate CPU/memory limits
3. **Persistent Storage**: Add PVCs for databases
4. **Network Policies**: Restrict inter-service communication
5. **RBAC**: Configure service accounts and roles
6. **Monitoring**: Deploy Prometheus and Grafana
7. **Logging**: Use EFK stack or similar
8. **Backup**: Regular backups of persistent data
