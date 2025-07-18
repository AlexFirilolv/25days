# Database Configuration

This document explains the database configuration for the 25days application, particularly for Kubernetes deployment.

## Overview

The application has been updated to support flexible database configuration that works both in local development and Kubernetes environments.

## Configuration Methods

### 1. Individual Environment Variables (Recommended for Kubernetes)

The application now supports individual database connection parameters:

```bash
MYSQL_HOST=your-database-host
MYSQL_PORT=3306
MYSQL_USER=your-username
MYSQL_PASSWORD=your-password
MYSQL_DATABASE=25days
```

### 2. DATABASE_URL (Legacy/Backwards Compatibility)

The traditional `DATABASE_URL` format is still supported:

```bash
DATABASE_URL="mysql://username:password@host:port/database"
```

**Priority**: If `DATABASE_URL` is provided, it takes precedence over individual variables.

## Local Development

For local development using Docker Compose, update your `.env` file:

```bash
# Database Configuration (Individual variables for Kubernetes compatibility)
MYSQL_HOST=db
MYSQL_PORT=3306
MYSQL_USER=25days
MYSQL_PASSWORD=MyGFHitsMe25!
MYSQL_DATABASE=25days

# Application Configuration
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
```

## Kubernetes Deployment

### External Secrets Configuration

The application uses External Secrets Operator to manage secrets. Update your secret store to include:

```yaml
# Database Configuration
/25days/db/host          # Database hostname (e.g., mysql-service.database.svc.cluster.local)
/25days/db/port          # Database port (e.g., 3306)
/25days/db/user          # Database username
/25days/db/password      # Database password
/25days/db/name          # Database name (e.g., 25days)

# AWS Configuration
/25days/aws/access-key   # AWS Access Key ID
/25days/aws/secret-access-key # AWS Secret Access Key
/25days/aws/region       # AWS Region
/25days/aws/bucket-name  # S3 Bucket Name

# Application Configuration
/25days/app/server-url   # Application server URL
```

### Deployment

The application deployment will automatically use the secrets created by External Secrets:

1. Apply the External Secrets configuration:
   ```bash
   kubectl apply -f k8s-external-secrets.yaml
   ```

2. Deploy the application:
   ```bash
   kubectl apply -f k8s-deployment.yaml
   ```

## Database Connection Logic

The application uses the following logic to determine database connection parameters:

1. **If `DATABASE_URL` is set**: Parse the URL and use those connection details
2. **If `DATABASE_URL` is not set**: Use individual environment variables:
   - `MYSQL_HOST` or `DB_HOST` (default: localhost)
   - `MYSQL_PORT` or `DB_PORT` (default: 3306)
   - `MYSQL_USER` or `DB_USER` (default: root)
   - `MYSQL_PASSWORD` or `DB_PASSWORD` (required)
   - `MYSQL_DATABASE` or `DB_NAME` (required)

## Error Handling

The application includes comprehensive error handling:

- Validates that required database parameters are provided
- Provides detailed error messages for connection failures
- Includes connection timeouts for production reliability
- Logs configuration details (with password hidden) for debugging

## Migration from DATABASE_URL

If you're migrating from the old `DATABASE_URL` approach:

1. **Local Development**: Update your `.env` file to use individual variables
2. **Production**: Update your secret store with the individual database parameters
3. **Testing**: The application supports both formats during the transition period

## Troubleshooting

### Connection Failures

If you encounter database connection issues:

1. Check that all required environment variables are set
2. Verify database connectivity from the pod/container
3. Check the application logs for detailed error messages
4. Ensure the database service is accessible from the application namespace

### Environment Variable Issues

- Ensure secrets are properly mounted in the Kubernetes deployment
- Verify that External Secrets Operator is functioning correctly
- Check that the secret store contains all required keys 