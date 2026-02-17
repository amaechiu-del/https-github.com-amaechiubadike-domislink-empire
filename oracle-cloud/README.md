# 🌩️ Oracle Cloud Free Tier - Backup Infrastructure

## Overview

This directory contains the complete infrastructure setup for deploying DomisLink backend services on Oracle Cloud Free Tier as a backup to Cloudflare Workers.

## 🎯 What's Included

**Oracle Cloud Free Tier Resources:**
- 4 ARM VMs (Ampere A1) - 24GB RAM total
- 200GB block storage
- 10TB bandwidth/month
- Load balancer
- **ALL FREE FOREVER** (not trial!)

**Services Deployed:**
- **VM1**: Auth Service + Payments Service
- **VM2**: Geolocation Service + Notifications Service
- **VM3**: Redis cache + Supabase backup (optional)
- **VM4**: Monitoring (Grafana + Prometheus)

## 🚀 Quick Start

### Prerequisites

- Oracle Cloud account (see `docs/ORACLE-SETUP.md`)
- OCI CLI installed and configured
- SSH key pair generated
- Docker and Docker Compose installed locally

### 1. Setup Oracle Cloud Account

```bash
# Follow the detailed guide
cat docs/ORACLE-SETUP.md
```

### 2. Create VMs

```bash
cd setup
./create-vms.sh
```

### 3. Deploy All Services

```bash
cd scripts
./deploy-all.sh
```

### 4. Verify Deployment

```bash
./health-check.sh
```

## 📁 Directory Structure

```
oracle-cloud/
├── setup/                    # Setup scripts for Oracle Cloud
├── services/                 # Backend microservices
│   ├── auth-service/
│   ├── payments-service/
│   ├── geolocation-service/
│   └── notifications-service/
├── infrastructure/           # Infrastructure configuration
│   ├── terraform/           # Infrastructure as Code
│   ├── nginx/              # Reverse proxy config
│   └── monitoring/         # Prometheus & Grafana
├── scripts/                 # Deployment & management scripts
├── docs/                    # Comprehensive documentation
└── .github/workflows/       # CI/CD automation
```

## 🔗 API Endpoints

Once deployed, services will be available at:

```
https://api.domislink.com/auth/*          # Auth Service
https://api.domislink.com/payments/*      # Payments Service
https://api.domislink.com/geo/*           # Geolocation Service
https://api.domislink.com/notify/*        # Notifications Service
https://monitoring.domislink.com          # Grafana Dashboard
```

## 📚 Documentation

- **[Oracle Setup Guide](docs/ORACLE-SETUP.md)** - Complete Oracle Cloud account setup
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Monitoring Guide](docs/MONITORING.md)** - Using Grafana and Prometheus
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions
- **[API Documentation](docs/API-DOCS.md)** - Complete API reference

## 🛡️ Security

- SSH key-only authentication
- Firewall rules (only necessary ports)
- HTTPS only with Let's Encrypt SSL
- Rate limiting on all endpoints
- Environment variables for secrets
- Fail2ban for brute force protection

## 💰 Cost Monitoring

**Target: $0/month** (Free Tier)

Monitor your usage:
```bash
oci limits quota list --compartment-id <your-compartment-id>
```

See `docs/ORACLE-SETUP.md` for detailed cost monitoring.

## 🔄 Maintenance

### Update Services

```bash
cd scripts
./deploy-all.sh
```

### View Logs

```bash
./logs.sh [service-name]
```

### Backup Data

```bash
./backup.sh
```

### Rollback

```bash
./rollback.sh
```

## 📊 Monitoring

Access Grafana dashboard:
```
https://monitoring.domislink.com
Default credentials: admin/admin (change immediately!)
```

## 🤝 Contributing

This is part of the DomisLink Empire ecosystem. See the main repository README for contribution guidelines.

## 📞 Support

- **Email**: amaechi@domislink.com
- **Issues**: Create an issue in the main repository

## ⚠️ Important Notes

- This is BACKUP infrastructure - Cloudflare Workers is primary
- Always monitor your Oracle Cloud usage to stay in free tier
- UK South (London) region recommended for Lagos users
- Can handle 10K+ requests/day on free tier
- All services are ARM64 compatible

## 🎉 Success Criteria

✅ 4 ARM VMs running  
✅ All services containerized  
✅ Nginx reverse proxy configured  
✅ SSL certificates active  
✅ Monitoring dashboard accessible  
✅ Health checks passing  
✅ CI/CD pipeline functional  
✅ Cost: $0/month  

---

**Built with ❤️ by DomisLink International Business Lagos**

*"I dey for you, Oga!"* 🚀
