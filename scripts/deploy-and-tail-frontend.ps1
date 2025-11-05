Param(
  [string]$Prefix = 'public',
  [string]$Branch = 'deploy-frontend',
  [string]$Remote = 'heroku',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-frontend-push.log',
  [switch]$Follow
)

Write-Output "Running frontend deploy script (prefix=$Prefix, branch=$Branch, remote=$Remote, target=$Target)..."

# Call the deploy script directly so Start-Process inside it handles output capture
& "$PSScriptRoot\deploy-frontend.ps1" -Prefix $Prefix -Branch $Branch -Remote $Remote -Target $Target -LogFile $LogFile

if (Test-Path $LogFile) {
  if ($Follow.IsPresent) {
    Write-Output "Tailing and following $LogFile (press Ctrl+C to stop)..."
    Get-Content $LogFile -Wait -Tail 200
  } else {
    Write-Output "Showing last 200 lines of $LogFile"
    Get-Content $LogFile -Tail 200
  }
} else {
  Write-Output "Log file '$LogFile' not created."
}
Param(
  [string]$Prefix = 'public',
  [string]$Branch = 'deploy-frontend',
  [string]$Remote = 'heroku',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-frontend-push.log',
  [switch]$Follow
)

Write-Output "Running frontend deploy script (prefix=$Prefix, branch=$Branch, remote=$Remote, target=$Target)..."

# Call the existing deploy-frontend script which performs subtree split and push and captures output
& "$PSScriptRoot\deploy-frontend.ps1" -Prefix $Prefix -Branch $Branch -Remote $Remote -Target $Target -LogFile $LogFile

if (Test-Path $LogFile) {
  if ($Follow.IsPresent) {
    Write-Output "Tailing and following $LogFile (press Ctrl+C to stop)..."
    Get-Content $LogFile -Wait -Tail 200
  } else {
    Write-Output "Showing last 200 lines of $LogFile"
    Get-Content $LogFile -Tail 200
  }
} else {
  Write-Output "Log file '$LogFile' not created."
}
