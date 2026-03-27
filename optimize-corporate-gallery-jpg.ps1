$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$targetDir = Join-Path $PSScriptRoot "images\Gallery\Firemne\decathlon-akcia"
if (-not (Test-Path $targetDir)) {
    throw "Directory not found: $targetDir"
}

$maxWidth = 1600
$jpegQuality = 75L

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq "image/jpeg" }
if (-not $jpegCodec) {
    throw "JPEG codec not available."
}

$qualityParam = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality,
    $jpegQuality
)
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = $qualityParam

$files = Get-ChildItem -Path $targetDir -File -Filter *.jpg | Sort-Object Name
$optimized = 0

foreach ($file in $files) {
    $srcPath = $file.FullName
    $tmpPath = "$srcPath.tmp.jpg"

    $img = [System.Drawing.Image]::FromFile($srcPath)
    try {
        $w = $img.Width
        $h = $img.Height
        $newW = $w
        $newH = $h

        if ($w -gt $maxWidth) {
            $ratio = $maxWidth / [double]$w
            $newW = [int][Math]::Round($w * $ratio)
            $newH = [int][Math]::Round($h * $ratio)
        }

        $bmp = New-Object System.Drawing.Bitmap $newW, $newH
        $gfx = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $gfx.DrawImage($img, 0, 0, $newW, $newH)
        } finally {
            $gfx.Dispose()
        }

        try {
            $bmp.Save($tmpPath, $jpegCodec, $encoderParams)
        } finally {
            $bmp.Dispose()
        }
    } finally {
        $img.Dispose()
    }

    Move-Item -Path $tmpPath -Destination $srcPath -Force
    $optimized++
}

Write-Host "Optimized JPG files: $optimized"
