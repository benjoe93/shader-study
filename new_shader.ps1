<#
.SYNOPSIS
  Create a new shader sketch by copying _blank.

.EXAMPLE
  .\new.ps1 001-uv-colors
#>
param(
  [Parameter(Mandatory)]
  [string]$Name
)

$ErrorActionPreference = 'Stop'

$template = Join-Path $PSScriptRoot '_blank'
$dest = Join-Path $PSScriptRoot $Name

if (-not (Test-Path $template)) {
  throw "Template not found: $template"
}
if (Test-Path $dest) {
  throw "'$Name' already exists."
}

Copy-Item $template $dest -Recurse

$indexPath = Join-Path $dest 'index.html'
$html = (Get-Content $indexPath -Raw).Replace('<title>_blank</title>', "<title>$Name</title>")
Set-Content $indexPath $html -NoNewline

Write-Host "Created $dest"
Write-Host "Right-click $Name\index.html -> Open with Live Server"
