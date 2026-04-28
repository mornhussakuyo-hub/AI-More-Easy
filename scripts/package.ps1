param(
  [string]$ExtensionDir = "aieban-modern-extension",
  [string]$OutDir = "dist",
  [string]$ReleaseBaseUrl = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$extensionPath = Resolve-Path (Join-Path $repoRoot $ExtensionDir)
$manifestPath = Join-Path $extensionPath "manifest.json"

if (!(Test-Path $manifestPath)) {
  throw "Cannot find manifest.json at $manifestPath"
}

$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$version = $manifest.version
$packageName = "aieban-modern-extension-v$version.zip"
$outPath = Join-Path $repoRoot $OutDir
$zipPath = Join-Path $outPath $packageName

New-Item -ItemType Directory -Force -Path $outPath | Out-Null

if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -LiteralPath $extensionPath -DestinationPath $zipPath -Force

$sha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()
$zipUrl = $packageName

if ($ReleaseBaseUrl.Trim()) {
  $base = $ReleaseBaseUrl.TrimEnd("/")
  $zipUrl = "$base/$packageName"
}

$latest = [ordered]@{
  name = $manifest.name
  version = $version
  zipUrl = $zipUrl
  sha256 = $sha256
  publishedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
  notes = "请下载新版压缩包后，在扩展管理页重新加载。"
}

$latestPath = Join-Path $outPath "latest.json"
$latest | ConvertTo-Json -Depth 4 | Set-Content -Encoding UTF8 -LiteralPath $latestPath

Write-Host "Package created: $zipPath"
Write-Host "Update manifest: $latestPath"
Write-Host "SHA256: $sha256"

