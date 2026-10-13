param([int]$StatusCode = 522)
$ErrorActionPreference = "Stop"
$global:RequestCalls = 0
$global:SavedJson = '{"url":"https://assigned-domain.pages.dev","status":"deployed"}'
function Get-Content { param($LiteralPath, [switch]$Raw) $global:SavedJson }
function Set-Content {
  param([Parameter(ValueFromPipeline = $true)]$Value, $LiteralPath, $Encoding)
  process { $global:SavedJson = $Value }
}
function Start-Sleep { param($Seconds) }
function Invoke-WebRequest {
  param($Uri, [switch]$UseBasicParsing, $TimeoutSec)
  $global:RequestCalls++
  if ($StatusCode -eq 0) { throw "Network unavailable" }
  @{ StatusCode = $StatusCode }
}
$failed = $false
try { & (Join-Path $PSScriptRoot "../scripts/verify-cloudflare.ps1") }
catch {
  $failed = $true
  if ($_.Exception.Message -notmatch "no re-upload needed") { throw }
}
$expectedCalls = if ($StatusCode -eq 404) { 1 } else { 6 }
if (-not $failed -or $global:RequestCalls -ne $expectedCalls -or ($global:SavedJson | ConvertFrom-Json).status -ne "verification_pending") { throw "Failed checks incorrectly marked the deployment ready." }
Write-Host "Persistent HTTP/network failure stays pending; retry bounds verified."
