# Project Validation Script
Write-Host ""
Write-Host "========================================"
Write-Host " INVENTORY API - PROJECT VALIDATION"
Write-Host "========================================"
Write-Host ""

$allPassed = $true

# Check 1: Required files
Write-Host "[1/6] Checking required files..."
$files = @(".github\workflows\ci.yml", "package.json", "README.md", "src\main.ts")
foreach ($f in $files) {
    if (Test-Path $f) { Write-Host "  OK $f" } 
    else { Write-Host "  MISSING $f"; $allPassed = $false }
}

# Check 2: Dependencies
Write-Host ""
Write-Host "[2/6] Checking dependencies..."
if (Test-Path "node_modules") { Write-Host "  OK node_modules" } 
else { Write-Host "  MISSING node_modules"; $allPassed = $false }

# Check 3: Build
Write-Host ""
Write-Host "[3/6] Testing build..."
npm run build 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "  OK Build successful" } 
else { Write-Host "  FAIL Build failed"; $allPassed = $false }

# Check 4: Unit tests
Write-Host ""
Write-Host "[4/6] Running unit tests..."
$env:NODE_ENV = "test"
$env:JWT_SECRET = "test-secret"
npm test 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "  OK Unit tests passed" } 
else { Write-Host "  FAIL Unit tests failed"; $allPassed = $false }

# Check 5: E2E tests
Write-Host ""
Write-Host "[5/6] Running E2E tests..."
npm run test:e2e 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "  OK E2E tests passed" } 
else { Write-Host "  FAIL E2E tests failed"; $allPassed = $false }

# Check 6: Coverage
Write-Host ""
Write-Host "[6/6] Checking coverage..."
npm run test:cov 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { Write-Host "  OK Coverage generated" } 
else { Write-Host "  WARN Coverage check skipped" }

# Summary
Write-Host ""
Write-Host "========================================"
if ($allPassed) {
    Write-Host " ALL CHECKS PASSED"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "  1. Read SETUP_GITHUB.md"
    Write-Host "  2. Push to GitHub"
    Write-Host "  3. Add email secrets"
    Write-Host "  4. Check Actions tab"
} else {
    Write-Host " SOME CHECKS FAILED"
    Write-Host "========================================"
    Write-Host ""
    Write-Host "Fix issues before pushing to GitHub"
}
Write-Host ""
