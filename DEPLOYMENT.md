# Deployment Guide

This document provides comprehensive instructions for deploying the Corporate AI LangChain application.

## Overview

The application is containerized using Docker and can be deployed using Docker Compose. The deployment includes:

- **Backend**: NestJS API with PostgreSQL database
- **Frontend**: Next.js application
- **Reverse Proxy**: Nginx for load balancing and SSL termination
- **Database**: PostgreSQL for data persistence

## Prerequisites

Before deploying, ensure you have the following installed:

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git

## Quick Start

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd corporate-ai-langchain
   ```

2. **Configure environment variables**:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Deploy using the deployment script**:
   ```powershell
   .\deploy.ps1
   ```

4. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://localhost:3001
   - Health Check: http://localhost/health

## Manual Deployment

If you prefer to deploy manually:

1. **Build and start services**:
   ```bash
   docker-compose up --build -d
   ```

2. **Check service status**:
   ```bash
   docker-compose ps
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=corporate_ai
DB_USER=postgres
DB_PASSWORD=your-secure-password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Application Configuration
NODE_ENV=production
PORT=3000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Security Considerations

- **JWT Secret**: Use a strong, randomly generated secret
- **Database Password**: Use a secure password for production
- **API Keys**: Keep OpenAI API keys secure and rotate regularly
- **HTTPS**: Configure SSL certificates for production deployments

## Production Deployment

### SSL Configuration

1. **Obtain SSL certificates** (Let's Encrypt recommended)
2. **Place certificates** in the `ssl/` directory:
   ```
   ssl/
   ├── cert.pem
   └── key.pem
   ```
3. **Uncomment HTTPS configuration** in `nginx.conf`
4. **Update domain name** in nginx configuration

### Database Migration

For production deployments with existing data:

1. **Backup existing database**:
   ```bash
   pg_dump -h localhost -U postgres corporate_ai > backup.sql
   ```

2. **Restore to new deployment**:
   ```bash
   psql -h localhost -U postgres corporate_ai < backup.sql
   ```

### Scaling

To scale the application:

1. **Horizontal scaling**:
   ```bash
   docker-compose up --scale backend=3 --scale frontend=2 -d
   ```

2. **Load balancer configuration**:
   Update nginx configuration to handle multiple backend instances

## Monitoring and Health Checks

### Health Check Endpoints

- **Application Health**: `GET /health`
- **Backend Health**: `GET /api/health`
- **Database Health**: Check PostgreSQL connection

### Logging

- **Application logs**: `docker-compose logs -f`
- **Nginx logs**: `docker-compose logs nginx`
- **Database logs**: `docker-compose logs postgres`

### Monitoring Tools

Consider integrating with:
- **Prometheus** for metrics collection
- **Grafana** for visualization
- **ELK Stack** for log aggregation

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   - Check if ports 80, 3000, 3001, 5432 are available
   - Modify ports in `docker-compose.yml` if needed

2. **Database connection issues**:
   - Verify PostgreSQL is running: `docker-compose ps postgres`
   - Check database logs: `docker-compose logs postgres`

3. **File upload issues**:
   - Verify upload directory permissions
   - Check file size limits in nginx configuration

4. **API connection issues**:
   - Verify backend is running: `docker-compose ps backend`
   - Check API logs: `docker-compose logs backend`

### Debug Commands

```bash
# Check service status
docker-compose ps

# View logs for specific service
docker-compose logs [service-name]

# Access container shell
docker-compose exec [service-name] sh

# Restart specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up --build -d
```

## Backup and Recovery

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres corporate_ai > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker-compose exec -T postgres psql -U postgres corporate_ai < backup_file.sql
```

### File Uploads Backup

```bash
# Backup uploads directory
docker-compose exec backend tar -czf uploads_backup.tar.gz /app/uploads

# Restore uploads
docker-compose exec backend tar -xzf uploads_backup.tar.gz -C /app/
```

## Performance Optimization

### Nginx Configuration

- **Gzip compression**: Enabled by default
- **Rate limiting**: Configured for API endpoints
- **Caching**: Add caching headers for static assets

### Database Optimization

- **Connection pooling**: Configure in TypeORM
- **Indexing**: Add indexes for frequently queried fields
- **Query optimization**: Monitor slow queries

### Application Optimization

- **Memory limits**: Set appropriate limits in Docker
- **CPU limits**: Configure resource constraints
- **Logging levels**: Adjust for production

## Security Best Practices

1. **Network security**:
   - Use internal Docker networks
   - Restrict external access to database
   - Implement proper firewall rules

2. **Application security**:
   - Regular security updates
   - Input validation and sanitization
   - Rate limiting and DDoS protection

3. **Data security**:
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Implement proper access controls

## Support

For deployment issues:

1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Test with minimal configuration first

## Version Management

- **Tag releases**: Use semantic versioning
- **Rollback strategy**: Keep previous versions available
- **Database migrations**: Test migrations before production 