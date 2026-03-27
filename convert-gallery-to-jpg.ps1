$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
$galleryRoot = Join-Path $root "images\Gallery"

if (-not (Test-Path $galleryRoot)) {
    throw "Gallery folder not found: $galleryRoot"
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" }

if (-not $jpegCodec) {
    throw "JPEG encoder not available."
}

$qualityParam = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    [long]88
)
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = $qualityParam

$pngFiles = Get-ChildItem -Path $galleryRoot -Recurse -File -Filter *.png
$converted = 0
$skipped = 0

foreach ($file in $pngFiles) {
    $jpgPath = [System.IO.Path]::ChangeExtension($file.FullName, ".jpg")
    if (Test-Path $jpgPath) {
        $skipped++
        continue
    }

    $image = [System.Drawing.Image]::FromFile($file.FullName)
    try {
        $bitmap = New-Object System.Drawing.Bitmap $image.Width, $image.Height
        $gfx = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $gfx.Clear([System.Drawing.Color]::White)
            $gfx.DrawImage($image, 0, 0, $image.Width, $image.Height)
        } finally {
            $gfx.Dispose()
        }

        try {
            $bitmap.Save($jpgPath, $jpegCodec, $encoderParams)
        } finally {
            $bitmap.Dispose()
        }
    } finally {
        $image.Dispose()
    }

    Remove-Item -Path $file.FullName -Force
    $converted++
}

Write-Host "Converted PNG -> JPG: $converted"
Write-Host "Skipped (already has JPG): $skipped"
