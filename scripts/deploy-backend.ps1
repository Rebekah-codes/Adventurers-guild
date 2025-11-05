Param(
  [string]$Prefix = 'backend',
  [string]$Branch = 'deploy-backend',
  [string]$Remote = 'heroku-backend',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-backend-push.log'
)

Write-Output "Creating subtree split for prefix '$Prefix' into branch '$Branch'..."
& git subtree split --prefix $Prefix -b $Branch
if ($LASTEXITCODE -ne 0) {
  Write-Error "subtree split failed (exit code $LASTEXITCODE). Aborting."
  exit $LASTEXITCODE
}

$msg = "Pushing branch '$Branch' to $($Remote):$($Target) (force). Logging to $LogFile"
Write-Output $msg
$ref = $Branch + ':' + $Target
& git push $Remote $ref --force *> $LogFile
if ($LASTEXITCODE -ne 0) {
  Write-Error "git push failed (exit code $LASTEXITCODE). See $LogFile for details."
  exit $LASTEXITCODE
}

Write-Output "Push queued and logged to $LogFile"

# Clean up the temporary branch if it exists
try {
  & git branch -D $Branch > $null 2>&1
  if ($LASTEXITCODE -eq 0) { Write-Output "Deleted local temporary branch '$Branch'" }
} catch {
  # non-fatal
}

Write-Output "Done."
