Param(
  [string]$Prefix = 'public',
  [string]$Branch = 'deploy-frontend',
  [string]$Remote = 'heroku',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-frontend-push.log'
)

Write-Output "Creating subtree split for prefix '$Prefix' into branch '$Branch'..."
try {
  $splitArgs = @('subtree','split','--prefix',$Prefix,'-b',$Branch)
  $splitOut = "$LogFile.split"
  $splitErr = "$LogFile.split.err"
  $splitProc = Start-Process -FilePath git -ArgumentList $splitArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $splitOut -RedirectStandardError $splitErr
  if ($splitProc.ExitCode -ne 0) {
    Write-Error "subtree split failed (exit code $($splitProc.ExitCode)). See $splitOut and $splitErr"
    if (Test-Path $splitErr) { Get-Content $splitErr | Out-File -FilePath $LogFile -Encoding utf8 -Append }
    if (Test-Path $splitOut) { Get-Content $splitOut | Out-File -FilePath $LogFile -Encoding utf8 -Append }
    exit $splitProc.ExitCode
  }
  # append split output to main logfile for convenience
  if (Test-Path $splitOut) { Get-Content $splitOut | Out-File -FilePath $LogFile -Encoding utf8 -Append }
  if (Test-Path $splitErr) { Get-Content $splitErr | Out-File -FilePath $LogFile -Encoding utf8 -Append }
} catch {
  Write-Error "Exception while running subtree split: $_"
  exit 1
}

Write-Output ("Pushing branch '{0}' to {1}:{2} (force). Logging to {3}" -f $Branch,$Remote,$Target,$LogFile)
# Use Start-Process to reliably capture stdout/stderr and avoid interactive blocking
try {
  $ref = $Branch + ':' + $Target
  $pushArgs = @('push',$Remote,$ref,'--force')
  $pushProc = Start-Process -FilePath git -ArgumentList $pushArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.err"
  if ($pushProc.ExitCode -ne 0) {
    Write-Error "git push failed (exit code $($pushProc.ExitCode)). See $LogFile and $LogFile.err for details."
    if (Test-Path "$LogFile.err") { Get-Content "$LogFile.err" | Out-File -FilePath $LogFile -Encoding utf8 -Append }
    exit $pushProc.ExitCode
  }
  if (Test-Path "$LogFile.err") { Get-Content "$LogFile.err" | Out-File -FilePath $LogFile -Encoding utf8 -Append }
} catch {
  Write-Error "Exception while running git push: $_"
  exit 1
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
