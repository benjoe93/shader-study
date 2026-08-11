<#
.SYNOPSIS
  Rename a shader sketch folder and update its <title>.

.EXAMPLE
  .\rename_shader.ps1 04_lighting 04_phong
#>
param(
  [Parameter(Mandatory)]
  [string]$CurrentName,

  [Parameter(Mandatory)]
  [string]$RequestedName
)

$ErrorActionPreference = 'Stop'

if ($RequestedName.IndexOfAny([IO.Path]::GetInvalidFileNameChars()) -ge 0) {
  throw "'$RequestedName' is not a valid folder name."
}

$source = Join-Path $PSScriptRoot $CurrentName
$dest = Join-Path $PSScriptRoot $RequestedName

if (-not (Test-Path $source)) {
  throw "Shader not found: $source"
}
if (Test-Path $dest) {
  throw "'$RequestedName' already exists."
}

# Update the title first, so a failed rename leaves nothing half-applied.
$indexPath = Join-Path $source 'index.html'
if (-not (Test-Path $indexPath)) {
  throw "index.html not found in: $source"
}

$html = Get-Content $indexPath -Raw
$pattern = '<title>\s*' + [regex]::Escape($CurrentName) + '\s*</title>'
$updated = [regex]::Replace($html, $pattern, "<title>$RequestedName</title>", 'IgnoreCase')

if ($updated -eq $html) {
  Write-Warning "No <title>$CurrentName</title> found in $indexPath - renaming the folder only."
}
else {
  Set-Content $indexPath $updated -NoNewline
}

try {
  Rename-Item -Path $source -NewName $RequestedName
}
catch {
  Set-Content $indexPath $html -NoNewline
  throw
}

Write-Host "Renamed: $CurrentName -> $RequestedName"
