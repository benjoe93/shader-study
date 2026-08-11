<#
.SYNOPSIS
  Copy a shader sketch folder to a new name and update its <title>.

.EXAMPLE
  .\copy_shader.ps1 04_lighting 07_vertex_transform
#>
param(
  [Parameter(Mandatory)]
  [string]$SourceName,

  [Parameter(Mandatory)]
  [string]$NewName
)

$ErrorActionPreference = 'Stop'

if ($NewName.IndexOfAny([IO.Path]::GetInvalidFileNameChars()) -ge 0) {
  throw "'$NewName' is not a valid folder name."
}

$source = Join-Path $PSScriptRoot $SourceName
$dest = Join-Path $PSScriptRoot $NewName

if (-not (Test-Path $source)) {
  throw "Shader not found: $source"
}
if (Test-Path $dest) {
  throw "'$NewName' already exists."
}

Copy-Item $source $dest -Recurse

# Retitle the copy, dropping it again if anything fails so nothing is half-applied.
try {
  $indexPath = Join-Path $dest 'index.html'
  if (Test-Path $indexPath) {
    $html = Get-Content $indexPath -Raw
    $pattern = '<title>\s*' + [regex]::Escape($SourceName) + '\s*</title>'
    $updated = [regex]::Replace($html, $pattern, "<title>$NewName</title>", 'IgnoreCase')

    if ($updated -eq $html) {
      Write-Warning "No <title>$SourceName</title> found in $indexPath - copying only."
    }
    else {
      Set-Content $indexPath $updated -NoNewline
    }
  }
  else {
    Write-Warning "index.html not found in: $dest"
  }
}
catch {
  Remove-Item $dest -Recurse -Force
  throw
}

Write-Host "Copied: $SourceName -> $NewName"
