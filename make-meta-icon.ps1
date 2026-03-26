$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "images\logo.png"
$out = Join-Path $PSScriptRoot "images\meta-app-icon-1024.png"

$size = 1024

$img = [System.Drawing.Image]::FromFile($src)
try {
    $w = $img.Width
    $h = $img.Height

    $scale = [Math]::Min($size / $w, $size / $h)
    $newW = [int][Math]::Round($w * $scale)
    $newH = [int][Math]::Round($h * $scale)

    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    try {
        $g.Clear([System.Drawing.Color]::White)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

        $x = [int](($size - $newW) / 2)
        $y = [int](($size - $newH) / 2)

        $rect = New-Object System.Drawing.Rectangle($x, $y, $newW, $newH)
        $g.DrawImage($img, $rect)
    } finally {
        $g.Dispose()
    }

    $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $img.Dispose()
}

$verify = [System.Drawing.Image]::FromFile($out)
try {
    Write-Host ("Saved {0} (orig: {1}x{2}, resized: {3}x{4}, output: {5}x{6})" -f $out, $w, $h, $newW, $newH, $verify.Width, $verify.Height)
} finally {
    $verify.Dispose()
}

