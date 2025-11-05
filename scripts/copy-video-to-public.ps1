Param(
  [string]$Source = "images\unfolding-old-paper-scroll-3d-4k-with-alpha-channel-SBV-304715149-preview.mp4",
  [string]$DestDir = "public\videos"
)

if (-Not (Test-Path $Source)) {
  Write-Error "Source file '$Source' not found. Please place it in the repository root 'images' folder."
  exit 2
}

if (-Not (Test-Path $DestDir)) {
  New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
  Write-Output "Created directory: $DestDir"
}

$destPath = Join-Path $DestDir (Split-Path $Source -Leaf)
Copy-Item -Path $Source -Destination $destPath -Force
Write-Output "Copied $Source -> $destPath"
