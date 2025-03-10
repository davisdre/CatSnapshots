# Docker Deployment Guide for CatSnapshots

This guide explains how to deploy the CatSnapshots application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system
- A Neon database URL (or other compatible database)

## Deployment Steps

### 1. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
DATABASE_URL=your_database_connection_string
```

Replace `your_database_connection_string` with your actual database connection string.

### 2. Build and start the Docker containers

```bash
docker-compose up -d
```

This command builds the Docker image and starts the container in detached mode.

### 3. Access the application

Once the container is running, you can access the application at:

```
http://localhost:5000
```

## Managing the Docker Deployment

### View logs

```bash
docker-compose logs -f
```

### Stop the application

```bash
docker-compose down
```

### Rebuild and restart the application (after code changes)

```bash
docker-compose up -d --build
```

## Troubleshooting

- If you encounter database connection issues, make sure your DATABASE_URL is correct and accessible from the Docker container.
- If the application fails to start, check the logs using `docker-compose logs -f`.
- Make sure port 5000 is not already in use on your host machine.

## Production Deployment Considerations

For production deployments, consider:

1. Using a reverse proxy like Nginx for SSL termination
2. Setting up proper monitoring and logging
3. Implementing container orchestration with Kubernetes for high availability
4. Using Docker secrets for sensitive information instead of environment variables 