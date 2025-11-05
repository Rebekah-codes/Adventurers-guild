Param(
  [string]$Prefix = 'backend',
  [string]$Branch = 'deploy-backend',
  [string]$Remote = 'heroku-backend',
  [string]$Target = 'main',
  [string]$LogFile = 'heroku-backend-push.log'
)

Write-Output "Creating subtree split for prefix '$Prefix' into branch '$Branch'..."
try {
  $splitArgs = @('subtree','split','--prefix',$Prefix,'-b',$Branch)
  $splitProc = Start-Process -FilePath git -ArgumentList $splitArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$LogFile.split" -RedirectStandardError "$LogFile.split.err"
  if ($splitProc.ExitCode -ne 0) {
    Write-Error "subtree split failed (exit code $($splitProc.ExitCode)). See $LogFile.split and $LogFile.split.err"
    exit $splitProc.ExitCode
  }
  # append split output to main logfile for convenience
  Get-Content "$LogFile.split" | Out-File -FilePath $LogFile -Encoding utf8 -Append
  Get-Content "$LogFile.split.err" | Out-File -FilePath $LogFile -Encoding utf8 -Append
} catch {
  Write-Error "Exception while running subtree split: $_"
  exit 1
}

try {
  $msg = "Pushing branch '$Branch' to $($Remote):$($Target) (force). Logging to $LogFile"
  Write-Output $msg
  $ref = $Branch + ':' + $Target
  $pushArgs = @('push',$Remote,$ref,'--force')
  # Start-Process with redirect avoids interactive prompts in the current terminal and reliably captures stdout/stderr
  $pushProc = Start-Process -FilePath git -ArgumentList $pushArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $LogFile -RedirectStandardError "$LogFile.err"
  if ($pushProc.ExitCode -ne 0) {
    Write-Error "git push failed (exit code $($pushProc.ExitCode)). See $LogFile and $LogFile.err for details."
    exit $pushProc.ExitCode
  }
  # Also append stderr if any
  if (Test-Path "$LogFile.err") { Get-Content "$LogFile.err" | Out-File -FilePath $LogFile -Encoding utf8 -Append }
} catch {
  Write-Error "Exception while running git push: $_"
  exit 1
}

Write-Output "Push queued and logged to $LogFile"

# Clean up the temporary branch if it exists
try {
  $delArgs = @('branch','-D',$Branch)
  $delProc = Start-Process -FilePath git -ArgumentList $delArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput "$null" -RedirectStandardError "$null" -ErrorAction SilentlyContinue
  if ($delProc -and $delProc.ExitCode -eq 0) { Write-Output "Deleted local temporary branch '$Branch'" }
} catch {
  # non-fatal
}

Write-Output "Done."
