Param(
  [string]$Source = "images\trees_and_people.png",
  [string]$DestDir = "public\images"
)

if (-Not (Test-Path $Source)) {
  Write-Error "Source file '$Source' not found in repo root. Please ensure the image exists."
  exit 2
}

if (-Not (Test-Path $DestDir)) {
  New-Item -ItemType Directory -Path $DestDir -Force | Out-Null
  Write-Output "Created directory: $DestDir"
}

$destPath = Join-Path $DestDir (Split-Path $Source -Leaf)
Copy-Item -Path $Source -Destination $destPath -Force
Write-Output "Copied $Source -> $destPath"
