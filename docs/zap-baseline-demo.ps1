# Runs OWASP ZAP baseline scan against the insecure demo and writes report to docs
param(
  [string]$TargetUrl = "http://host.docker.internal:3002",
  [string]$Report = "zap_insecure_demo.html"
)

$docs = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check docker
$docker = (Get-Command docker -ErrorAction SilentlyContinue)
if (-not $docker) {
  Write-Error "Docker is not installed or not in PATH. Install Docker Desktop to run this script."
  exit 1
}

# Pull image if missing and run baseline scan
Write-Host "Running ZAP baseline scan against $TargetUrl ..."
$cmd = "docker run --rm -u root -v `"$docs:/zap/wrk`" owasp/zap2docker-stable zap-baseline.py -t $TargetUrl -r $Report"
Write-Host $cmd
Invoke-Expression $cmd

if (Test-Path (Join-Path $docs $Report)) {
  Write-Host "Report written to: " (Join-Path $docs $Report)
} else {
  Write-Warning "Report not found. Check Docker output for errors."
}
