param([switch]$EmptyDomains)
$ErrorActionPreference = "Stop"
$global:ListCalls = 0
$global:DeployArgs = ""
$global:BuildCalled = $false
$global:RequestCalls = 0
$global:RetrySleeps = 0

function node {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$NativeArgs)
  $global:LASTEXITCODE = 0
  if ($NativeArgs -contains "list") {
    $global:ListCalls++
    if ($global:ListCalls -eq 1) { "[]" }
    elseif ($EmptyDomains) { '[{"Project Name":"release-test","Project Domains":"","Git Provider":"No"}]' }
    else { '[{"Project Name":"release-test","Project Domains":"assigned-domain.pages.dev, custom.example.com","Git Provider":"No"}]' }
  } elseif ($NativeArgs -contains "create") { "Created: https://assigned-domain.pages.dev/" }
  elseif ($NativeArgs -contains "deploy") { $global:DeployArgs = $NativeArgs -join " " }
}
function npm.cmd {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$NativeArgs)
  $global:LASTEXITCODE = 0
  if ($NativeArgs -contains "build:release") {
    if ($env:SITE_URL -ne "https://assigned-domain.pages.dev" -or $env:PORTFOLIO_RELEASE -ne "1") { throw "Release did not use the returned Cloudflare origin." }
    $global:BuildCalled = $true
  }
}
function Set-Content {
  param([Parameter(ValueFromPipeline = $true)]$Value, $LiteralPath, $Encoding)
  process {
    if ($LiteralPath -ne "release-cloudflare.json") { throw "Unexpected file write." }
    $global:SavedJson = $Value
  }
}
function Get-Content { param($LiteralPath, [switch]$Raw) $global:SavedJson }
function Invoke-WebRequest {
  param($Uri, [switch]$UseBasicParsing, $TimeoutSec)
  if (-not $Uri.StartsWith("https://assigned-domain.pages.dev/")) { throw "Unexpected deployment check URL." }
  $global:RequestCalls++
  if ($global:RequestCalls -eq 1) { return @{ StatusCode = 522 } }
  @{ StatusCode = 200 }
}
function Start-Sleep { param($Seconds) $global:RetrySleeps++ }

& (Join-Path $PSScriptRoot "../scripts/deploy-cloudflare.ps1") -ProjectName "release-test"
if (-not $global:BuildCalled -or $global:DeployArgs -notmatch 'pages deploy out --project-name release-test --branch main') { throw "Deployment flow was incomplete." }
if ($global:RetrySleeps -ne 1 -or $global:RequestCalls -ne 8) { throw "Transient522 was not retried correctly." }
if (($global:SavedJson | ConvertFrom-Json).status -ne "verified") { throw "Deployment was not marked verified after all routes passed." }
Write-Host "Deployment orchestration test passed; no network calls or file writes performed."
