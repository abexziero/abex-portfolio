param([string]$ProjectName = "abexziero")
$ErrorActionPreference = "Stop"
Set-Location -LiteralPath (Split-Path -Parent $PSScriptRoot)
if ($ProjectName -notmatch '^[a-z0-9][a-z0-9-]{0,57}[a-z0-9]$') { throw "Invalid Pages project name." }
$env:WRANGLER_SEND_METRICS = "false"
$env:WRANGLER_LOG_PATH = Join-Path (Get-Location) ".wrangler/logs"

function Invoke-PagesCli {
  param([string[]]$CliArguments)
  $cachedCli = Join-Path (Get-Location) ".wrangler/tools/node_modules/wrangler/bin/wrangler.js"
  if (Test-Path -LiteralPath $cachedCli) { & node $cachedCli @CliArguments }
  else { & npx.cmd --yes wrangler@4.147.0 @CliArguments }
  if ($LASTEXITCODE -ne 0) { throw "Cloudflare command failed. Run the script from a normal PowerShell terminal with network access." }
}

$projects = (Invoke-PagesCli -CliArguments @("pages", "project", "list", "--json")) -join "`n" | ConvertFrom-Json
$project = $projects | Where-Object { $_.'Project Name' -eq $ProjectName } | Select-Object -First 1
if ($project) {
  if (-not (Test-Path -LiteralPath "release-cloudflare.json")) { throw "Project already exists. Use -ProjectName with a new name to avoid overwriting another site." }
  $saved = Get-Content -LiteralPath "release-cloudflare.json" -Raw | ConvertFrom-Json
  if ($saved.project -ne $ProjectName -or $saved.production_branch -ne "main") { throw "Existing project is not this site's saved deployment." }
}
if (-not $project) {
  $createdOutput = (Invoke-PagesCli -CliArguments @("pages", "project", "create", $ProjectName, "--production-branch", "main")) -join "`n"
  Write-Host $createdOutput
  $createdDomain = [regex]::Match($createdOutput, 'https://([a-z0-9-]+\.pages\.dev)').Groups[1].Value
  @{ project = $ProjectName; url = ("https://" + $createdDomain); production_branch = "main"; status = "created" } | ConvertTo-Json | Set-Content -LiteralPath "release-cloudflare.json" -Encoding UTF8
  $projects = (Invoke-PagesCli -CliArguments @("pages", "project", "list", "--json")) -join "`n" | ConvertFrom-Json
  $project = $projects | Where-Object { $_.'Project Name' -eq $ProjectName } | Select-Object -First 1
}
$domain = (($project.'Project Domains' -split ',') | ForEach-Object { $_.Trim() } | Where-Object { $_ -match '^[a-z0-9-]+\.pages\.dev$' } | Select-Object -First 1)
if (-not $domain) {
  $savedUrl = (Get-Content -LiteralPath "release-cloudflare.json" -Raw | ConvertFrom-Json).url
  $domain = [regex]::Match($savedUrl, '^https://([a-z0-9-]+\.pages\.dev)$').Groups[1].Value
}
if (-not $domain) { throw "Cloudflare did not return the project URL; release cancelled." }
if ($ProjectName -eq "abexziero" -and $domain -ne "abexziero.pages.dev") { throw "Cloudflare assigned another URL. The requested abexziero.pages.dev is not available; no upload performed." }
$env:SITE_URL = "https://" + $domain
@{ project = $ProjectName; url = $env:SITE_URL; production_branch = "main"; status = "prepared" } | ConvertTo-Json | Set-Content -LiteralPath "release-cloudflare.json" -Encoding UTF8
$env:PORTFOLIO_RELEASE = "1"
& npm.cmd run test
if ($LASTEXITCODE -ne 0) { throw "Tests failed." }
& npm.cmd run typecheck
if ($LASTEXITCODE -ne 0) { throw "Typecheck failed." }
& npm.cmd run lint
if ($LASTEXITCODE -ne 0) { throw "Lint failed." }
& npm.cmd run build:release
if ($LASTEXITCODE -ne 0) { throw "Release build failed." }
Invoke-PagesCli -CliArguments @("pages", "deploy", "out", "--project-name", $ProjectName, "--branch", "main")
@{ project = $ProjectName; url = $env:SITE_URL; production_branch = "main"; status = "deployed"; deployed_at = (Get-Date).ToUniversalTime().ToString("o") } | ConvertTo-Json | Set-Content -LiteralPath "release-cloudflare.json" -Encoding UTF8
& (Join-Path $PSScriptRoot "verify-cloudflare.ps1")
