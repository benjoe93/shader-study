<#
.SYNOPSIS
  Create a new shader sketch by copying _templates\_blank.

.EXAMPLE
  .\new_shader.ps1 04_Waves
#>
param(
  [Parameter(Mandatory)]
  [string]$Name
)

$ErrorActionPreference = 'Stop'

$template = Join-Path $PSScriptRoot '_templates\_blank'
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

Write-Host "Created $Name: $dest"
