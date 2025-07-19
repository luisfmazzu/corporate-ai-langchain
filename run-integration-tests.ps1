# Integration Test Runner Script
# This script runs comprehensive integration tests for the entire application

Write-Host "Starting Comprehensive Integration Tests..." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "test"
$env:OPENAI_API_KEY = "test-key"

# Function to run tests and handle results
function Run-Test {
    param(
        [string]$TestName,
        [string]$Command,
        [string]$WorkingDirectory
    )
    
    Write-Host "`nRunning $TestName..." -ForegroundColor Yellow
    Write-Host "Command: $Command" -ForegroundColor Gray
    Write-Host "Directory: $WorkingDirectory" -ForegroundColor Gray
    
    Push-Location $WorkingDirectory
    
    try {
        $result = Invoke-Expression $Command
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $TestName completed successfully" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $TestName failed with exit code $LASTEXITCODE" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $TestName failed with error: $_" -ForegroundColor Red
        return $false
    }
    finally {
        Pop-Location
    }
}

# Track overall success
$overallSuccess = $true

# Run Backend Unit Tests
$backendUnitSuccess = Run-Test -TestName "Backend Unit Tests" -Command "npm test" -WorkingDirectory "backend"
if (-not $backendUnitSuccess) { $overallSuccess = $false }

# Run Backend Integration Tests
$backendIntegrationSuccess = Run-Test -TestName "Backend Integration Tests" -Command "npm run test:integration" -WorkingDirectory "backend"
if (-not $backendIntegrationSuccess) { $overallSuccess = $false }

# Run Frontend Unit Tests
$frontendUnitSuccess = Run-Test -TestName "Frontend Unit Tests" -Command "npm test" -WorkingDirectory "frontend"
if (-not $frontendUnitSuccess) { $overallSuccess = $false }

# Run Frontend E2E Tests (if backend is running)
Write-Host "`nStarting Backend Server for E2E Tests..." -ForegroundColor Yellow
Start-Process -FilePath "npm" -ArgumentList "run", "start:dev" -WorkingDirectory "backend" -WindowStyle Hidden
Start-Sleep -Seconds 10  # Wait for backend to start

$frontendE2ESuccess = Run-Test -TestName "Frontend E2E Tests" -Command "npm run test:e2e" -WorkingDirectory "frontend"
if (-not $frontendE2ESuccess) { $overallSuccess = $false }

# Stop backend server
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { $_.ProcessName -eq "node" } | Stop-Process -Force

# Summary
Write-Host "`n=============================================" -ForegroundColor Green
Write-Host "Integration Test Summary:" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Backend Unit Tests: $(if ($backendUnitSuccess) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($backendUnitSuccess) { 'Green' } else { 'Red' })
Write-Host "Backend Integration Tests: $(if ($backendIntegrationSuccess) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($backendIntegrationSuccess) { 'Green' } else { 'Red' })
Write-Host "Frontend Unit Tests: $(if ($frontendUnitSuccess) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($frontendUnitSuccess) { 'Green' } else { 'Red' })
Write-Host "Frontend E2E Tests: $(if ($frontendE2ESuccess) { '✅ PASSED' } else { '❌ FAILED' })" -ForegroundColor $(if ($frontendE2ESuccess) { 'Green' } else { 'Red' })

if ($overallSuccess) {
    Write-Host "`n🎉 All integration tests passed!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "`n💥 Some integration tests failed!" -ForegroundColor Red
    exit 1
} 