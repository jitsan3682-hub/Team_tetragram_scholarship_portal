# =====================================================================
# Push EduCamino Portal to GitHub
# Target: https://github.com/jitsan3682-hub/Team_tetragram_scholarship_portal
# =====================================================================

Write-Host "`n>>> Checking Git installation..." -ForegroundColor Cyan

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Git is not found in PATH." -ForegroundColor Yellow
    Write-Host "    Installing Git via winget..." -ForegroundColor Cyan
    winget install --id Git.Git -e --source winget
    Write-Host "`nPlease restart your terminal or PowerShell after Git finishes installing, then re-run this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Git is available: $(git --version)" -ForegroundColor Green

# Set location to workspace root
Set-Location "c:\Users\sanjit\OneDrive\Documents\antigravity"

# Initialize git if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host ">>> Initializing local Git repository..." -ForegroundColor Cyan
    git init
}

# Stage all files
Write-Host ">>> Staging files (ignoring node_modules and builds)..." -ForegroundColor Cyan
git add .

# Create commit
Write-Host ">>> Creating commit..." -ForegroundColor Cyan
git commit -m "feat: complete EduCamino India portal for TEZHACK 2026 (WEB02 + WEB-004(2))"

# Set branch to main
git branch -M main

# Configure remote
$RemoteUrl = "https://github.com/jitsan3682-hub/Team_tetragram_scholarship_portal.git"
Write-Host ">>> Setting remote origin to $RemoteUrl..." -ForegroundColor Cyan

$ExistingRemote = git remote get-url origin 2>$null
if ($ExistingRemote) {
    git remote set-url origin $RemoteUrl
} else {
    git remote add origin $RemoteUrl
}

# Push to GitHub
Write-Host "`n>>> Pushing code to GitHub (main branch)..." -ForegroundColor Cyan
Write-Host "    Note: If prompted for credentials, use your GitHub username and a Personal Access Token (PAT)." -ForegroundColor Yellow
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n============================================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Code pushed to: https://github.com/jitsan3682-hub/Team_tetragram_scholarship_portal" -ForegroundColor Green
    Write-Host "============================================================`n" -ForegroundColor Green
} else {
    Write-Host "`n[!] Push failed. Check your GitHub credentials / Personal Access Token." -ForegroundColor Red
}
