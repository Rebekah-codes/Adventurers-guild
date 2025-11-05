Param(
  [string]$Prefix = 'backend',
  [string]$Branch = 'deploy-backend',
  [string]$Remote = 'heroku-backend',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-backend-push.log'
)

Write-Output "Running backend deploy (detached follow). This will leave your terminal free and open a new window to follow the log."

# Run the existing backend deploy script (it writes the log)
& "$PSScriptRoot\deploy-backend.ps1" -Prefix $Prefix -Branch $Branch -Remote $Remote -Target $Target -LogFile $LogFile

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
