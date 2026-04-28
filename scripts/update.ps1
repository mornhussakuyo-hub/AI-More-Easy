param(
  [Parameter(Mandatory = $true)]
  [string]$ManifestUrl,

  [string]$InstallDir = "aieban-modern-extension",

  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Convert-VersionParts([string]$Version) {
  return ($Version -split "[^\d]+") |
    Where-Object { $_ -ne "" } |
    ForEach-Object { [int]$_ }
}

function Compare-Semver([string]$Left, [string]$Right) {
  $a = @(Convert-VersionParts $Left)
  $b = @(Convert-VersionParts $Right)
  $max = [Math]::Max($a.Count, $b.Count)

  for ($i = 0; $i -lt $max; $i++) {
    $av = if ($i -lt $a.Count) { $a[$i] } else { 0 }
    $bv = if ($i -lt $b.Count) { $b[$i] } else { 0 }
    if ($av -gt $bv) { return 1 }
    if ($av -lt $bv) { return -1 }
  }

  return 0
}

function Resolve-DownloadUrl([string]$BaseUrl, [string]$MaybeRelativeUrl) {
  if ($MaybeRelativeUrl -match "^https?://") {
    return $MaybeRelativeUrl
  }

  if ($BaseUrl -notmatch "^https?://") {
    $basePath = if ([IO.Path]::IsPathRooted($BaseUrl)) {
      $BaseUrl
    } else {
      Join-Path $repoRoot $BaseUrl
    }
    return (Join-Path (Split-Path -Parent $basePath) $MaybeRelativeUrl)
  }

  $baseUri = [Uri]$BaseUrl
  return ([Uri]::new($baseUri, $MaybeRelativeUrl)).AbsoluteUri
}

function Get-UpdateManifest([string]$Source) {
  if ($Source -match "^https?://") {
    return Invoke-RestMethod -Uri $Source -UseBasicParsing
  }

  $path = if ([IO.Path]::IsPathRooted($Source)) {
    $Source
  } else {
    Join-Path $repoRoot $Source
  }

  return Get-Content -Raw -LiteralPath $path | ConvertFrom-Json
}

function Save-UpdatePackage([string]$Source, [string]$Destination) {
  if ($Source -match "^https?://") {
    Invoke-WebRequest -Uri $Source -OutFile $Destination -UseBasicParsing
    return
  }

  $path = if ([IO.Path]::IsPathRooted($Source)) {
    $Source
  } else {
    Join-Path $repoRoot $Source
  }

  Copy-Item -LiteralPath $path -Destination $Destination -Force
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$installPath = (Resolve-Path (Join-Path $repoRoot $InstallDir)).Path
$localManifestPath = Join-Path $installPath "manifest.json"

if (!(Test-Path $localManifestPath)) {
  throw "Cannot find installed extension manifest at $localManifestPath"
}

$localManifest = Get-Content -Raw -LiteralPath $localManifestPath | ConvertFrom-Json
$localVersion = $localManifest.version

Write-Host "Current version: $localVersion"
Write-Host "Checking: $ManifestUrl"

$remote = Get-UpdateManifest $ManifestUrl
if (!$remote.version -or !$remote.zipUrl) {
  throw "Update manifest must contain version and zipUrl."
}

$remoteVersion = [string]$remote.version
$hasNewVersion = (Compare-Semver $remoteVersion $localVersion) -gt 0

if (!$hasNewVersion -and !$Force) {
  Write-Host "Already up to date: $localVersion"
  return
}

$zipUrl = Resolve-DownloadUrl $ManifestUrl ([string]$remote.zipUrl)
$tempRoot = Join-Path ([IO.Path]::GetTempPath()) ("aieban-update-" + [Guid]::NewGuid().ToString("N"))
  $zipPath = Join-Path $tempRoot "package.zip"
$extractPath = Join-Path $tempRoot "extract"

New-Item -ItemType Directory -Force -Path $tempRoot, $extractPath | Out-Null

try {
  Write-Host "Downloading: $zipUrl"
  Save-UpdatePackage $zipUrl $zipPath

  if ($remote.sha256) {
    $actualSha = (Get-FileHash -Algorithm SHA256 -LiteralPath $zipPath).Hash.ToLowerInvariant()
    $expectedSha = ([string]$remote.sha256).ToLowerInvariant()
    if ($actualSha -ne $expectedSha) {
      throw "SHA256 mismatch. Expected $expectedSha, got $actualSha"
    }
  }

  Expand-Archive -LiteralPath $zipPath -DestinationPath $extractPath -Force

  $candidate = Get-ChildItem -Path $extractPath -Recurse -Filter "manifest.json" |
    Where-Object { $_.FullName -match "aieban-modern-extension[\\/]+manifest\.json$|manifest\.json$" } |
    Select-Object -First 1

  if (!$candidate) {
    throw "Downloaded package does not contain manifest.json"
  }

  $newExtensionPath = Split-Path -Parent $candidate.FullName
  $backupPath = "$installPath.backup-$localVersion"

  if (Test-Path $backupPath) {
    Remove-Item -LiteralPath $backupPath -Recurse -Force
  }

  Copy-Item -LiteralPath $installPath -Destination $backupPath -Recurse -Force

  Get-ChildItem -LiteralPath $installPath | Remove-Item -Recurse -Force
  Get-ChildItem -LiteralPath $newExtensionPath | Copy-Item -Destination $installPath -Recurse -Force

  Write-Host "Updated to $remoteVersion"
  Write-Host "Backup saved to: $backupPath"
  Write-Host "Open edge://extensions/ or chrome://extensions/ and click Reload for AI更易办."
} finally {
  if (Test-Path $tempRoot) {
    Remove-Item -LiteralPath $tempRoot -Recurse -Force
  }
}
