# Deployment Script for Corporate AI LangChain Application
# This script handles the complete deployment process

param(
    [string]$Environment = "development",
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$Force
)

Write-Host "Starting deployment for environment: $Environment" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Configuration
$DOCKER_COMPOSE_FILE = "docker-compose.yml"
$ENV_FILE = ".env"

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "Checking prerequisites..." -ForegroundColor Yellow
    
    # Check if Docker is installed
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed or not in PATH"
        exit 1
    }
    
    # Check if Docker Compose is available
    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed or not in PATH"
        exit 1
    }
    
    # Check if .env file exists
    if (-not (Test-Path $ENV_FILE)) {
        Write-Warning ".env file not found. Creating from template..."
        Copy-Item "env.example" $ENV_FILE -ErrorAction SilentlyContinue
        Write-Host "Please configure your .env file before continuing." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "Prerequisites check passed!" -ForegroundColor Green
}

# Function to run tests
function Invoke-Tests {
    if ($SkipTests) {
        Write-Host "Skipping tests as requested." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Running tests..." -ForegroundColor Yellow
    
    # Backend tests
    Write-Host "Running backend tests..." -ForegroundColor Cyan
    Set-Location "backend"
    try {
        npm test
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Backend tests failed"
            exit 1
        }
    }
    finally {
        Set-Location ".."
    }
    
    # Frontend tests
    Write-Host "Running frontend tests..." -ForegroundColor Cyan
    Set-Location "frontend"
    try {
        npm test
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Frontend tests failed"
            exit 1
        }
    }
    finally {
        Set-Location ".."
    }
    
    Write-Host "All tests passed!" -ForegroundColor Green
}

# Function to build application
function Invoke-Build {
    if ($SkipBuild) {
        Write-Host "Skipping build as requested." -ForegroundColor Yellow
        return
    }
    
    Write-Host "Building application..." -ForegroundColor Yellow
    
    # Build backend
    Write-Host "Building backend..." -ForegroundColor Cyan
    Set-Location "backend"
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Backend build failed"
            exit 1
        }
    }
    finally {
        Set-Location ".."
    }
    
    # Build frontend
    Write-Host "Building frontend..." -ForegroundColor Cyan
    Set-Location "frontend"
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Frontend build failed"
            exit 1
        }
    }
    finally {
        Set-Location ".."
    }
    
    Write-Host "Build completed successfully!" -ForegroundColor Green
}

# Function to deploy with Docker Compose
function Invoke-DockerDeploy {
    Write-Host "Deploying with Docker Compose..." -ForegroundColor Yellow
    
    # Stop existing containers
    Write-Host "Stopping existing containers..." -ForegroundColor Cyan
    docker-compose down
    
    # Remove old images if force flag is set
    if ($Force) {
        Write-Host "Removing old images..." -ForegroundColor Cyan
        docker-compose down --rmi all
    }
    
    # Build and start services
    Write-Host "Building and starting services..." -ForegroundColor Cyan
    docker-compose up --build -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker Compose deployment failed"
        exit 1
    }
    
    # Wait for services to be healthy
    Write-Host "Waiting for services to be ready..." -ForegroundColor Cyan
    Start-Sleep -Seconds 30
    
    # Check service health
    Write-Host "Checking service health..." -ForegroundColor Cyan
    $healthy = $true
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Host "Application is healthy!" -ForegroundColor Green
        } else {
            $healthy = $false
        }
    }
    catch {
        Write-Warning "Health check failed, but deployment may still be successful"
        $healthy = $false
    }
    
    if ($healthy) {
        Write-Host "Deployment completed successfully!" -ForegroundColor Green
        Write-Host "Application is available at: http://localhost" -ForegroundColor Cyan
    } else {
        Write-Warning "Deployment completed, but health check failed"
        Write-Host "Check logs with: docker-compose logs" -ForegroundColor Yellow
    }
}

# Function to show deployment status
function Show-Status {
    Write-Host "`nDeployment Status:" -ForegroundColor Yellow
    Write-Host "==================" -ForegroundColor Yellow
    
    docker-compose ps
    
    Write-Host "`nRecent logs:" -ForegroundColor Yellow
    docker-compose logs --tail=20
}

# Main deployment process
try {
    Test-Prerequisites
    Invoke-Tests
    Invoke-Build
    Invoke-DockerDeploy
    Show-Status
}
catch {
    Write-Error "Deployment failed: $($_.Exception.Message)"
    exit 1
} 