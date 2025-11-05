Param(
  [string]$Prefix = 'public',
  [string]$Branch = 'deploy-frontend',
  [string]$Remote = 'heroku',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-frontend-push.log'
)

Write-Output "Running frontend deploy (detached follow). This will leave your terminal free and open a new window to follow the log."

# Run the existing deploy script (it writes the log)
& "$PSScriptRoot\deploy-frontend.ps1" -Prefix $Prefix -Branch $Branch -Remote $Remote -Target $Target -LogFile $LogFile

# Compute absolute log path (repo root is parent of scripts folder)
$repoRoot = Split-Path -Parent $PSScriptRoot
$logFull = Join-Path $repoRoot $LogFile

if (Test-Path $logFull) {
  Write-Output "Opening new PowerShell window to follow: $logFull"
  $cmd = "Get-Content -Path `"$logFull`" -Wait -Tail 200"
  Start-Process -FilePath powershell -ArgumentList @('-NoProfile','-NoExit','-Command',$cmd) -WindowStyle Normal
} else {
  Write-Output "Log file not found: $logFull"
}
