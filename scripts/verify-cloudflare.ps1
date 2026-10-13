$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
$deployment = Get-Content -LiteralPath "release-cloudflare.json" -Raw | ConvertFrom-Json
$origin = $deployment.url
if ($origin -notmatch '^https://[a-z0-9-]+\.pages\.dev$') { throw "Invalid saved Pages URL." }
foreach ($path in @("/id", "/en", "/id/about", "/en/services", "/id/projects/jelajanime", "/robots.txt", "/sitemap.xml")) {
  $ready = $false
  for ($attempt = 1; $attempt -le 6; $attempt++) {
    $status = 0
    try { $status = (Invoke-WebRequest -Uri ($origin + $path) -UseBasicParsing -TimeoutSec 15).StatusCode }
    catch { if ($_.Exception.Response) { $status = [int]$_.Exception.Response.StatusCode } }
    if ($status -eq 200) { $ready = $true; break }
    if ($status -ne 0 -and $status -ne 429 -and $status -lt 500) { break }
    if ($attempt -lt 6) { Write-Host ("Checking again: " + $path + " (HTTP " + $status + ")"); Start-Sleep -Seconds 5 }
  }
  if (-not $ready) {
    $deployment.status = "verification_pending"
    $deployment | ConvertTo-Json | Set-Content -LiteralPath "release-cloudflare.json" -Encoding UTF8
    throw "Upload succeeded, but $origin$path is not verified (HTTP $status). Run npm.cmd run verify:cloudflare later; no re-upload needed."
  }
}
$deployment.status = "verified"
$deployment | Add-Member -NotePropertyName verified_at -NotePropertyValue (Get-Date).ToUniversalTime().ToString("o") -Force
$deployment | ConvertTo-Json | Set-Content -LiteralPath "release-cloudflare.json" -Encoding UTF8
Write-Host ("Published: " + $origin) -ForegroundColor Green
