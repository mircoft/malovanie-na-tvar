$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$galleryRoot = Join-Path $root "images\Gallery"
$extensions = @("*.jpg", "*.jpeg", "*.png", "*.webp")

if (-not (Test-Path $galleryRoot)) {
    New-Item -ItemType Directory -Path $galleryRoot | Out-Null
}

$categoryMap = @{
    "oslavy" = "oslava"
    "sukromne" = "oslava"
    "festivaly" = "festival"
    "festival" = "festival"
    "firemne" = "firemna"
    "firemna" = "firemna"
}

$items = @()
$files = Get-ChildItem -Path $galleryRoot -Recurse -File -Include $extensions -ErrorAction SilentlyContinue |
    Sort-Object FullName

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($galleryRoot.Length + 1).Replace('\', '/')
    $firstSegment = ($relativePath -split '/')[0].ToLowerInvariant()
    $category = $categoryMap[$firstSegment]
    if (-not $category) {
        continue
    }

    $items += [ordered]@{
        category = $category
        image = "images/Gallery/$relativePath"
        title = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
    }
}

$manifestPath = Join-Path $galleryRoot "gallery-manifest.json"
$payload = [ordered]@{ items = $items }
$payload | ConvertTo-Json -Depth 5 | Set-Content -Path $manifestPath -Encoding UTF8

Write-Host "Saved $manifestPath with $($items.Count) items."
