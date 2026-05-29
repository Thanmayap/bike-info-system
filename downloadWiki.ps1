$logos = @(
    @{ Name = "royal_enfield"; Url = "https://upload.wikimedia.org/wikipedia/commons/c/c5/Royal_Enfield_Logo.svg" },
    @{ Name = "tvs"; Url = "https://upload.wikimedia.org/wikipedia/commons/e/e0/TVS_Motor_Company_Logo.svg" },
    @{ Name = "bajaj"; Url = "https://upload.wikimedia.org/wikipedia/commons/4/4e/Bajaj_Auto_logo.svg" },
    @{ Name = "honda"; Url = "https://upload.wikimedia.org/wikipedia/commons/c/c2/Honda_wing_logo.svg" },
    @{ Name = "yamaha"; Url = "https://upload.wikimedia.org/wikipedia/commons/8/8b/Yamaha_Motor_Logo_%281998%29.svg" },
    @{ Name = "hero"; Url = "https://upload.wikimedia.org/wikipedia/commons/b/bc/Hero_MotoCorp_Logo.svg" },
    @{ Name = "suzuki"; Url = "https://upload.wikimedia.org/wikipedia/commons/1/12/Suzuki_logo_2.svg" },
    @{ Name = "ktm"; Url = "https://upload.wikimedia.org/wikipedia/commons/d/dd/KTM_logo.svg" },
    @{ Name = "triumph"; Url = "https://upload.wikimedia.org/wikipedia/commons/9/9f/Triumph_Motorcycles_logo.svg" },
    @{ Name = "kawasaki"; Url = "https://upload.wikimedia.org/wikipedia/commons/3/30/Kawasaki_Heavy_Industries_Logo.svg" },
    @{ Name = "bmw"; Url = "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
    @{ Name = "ducati"; Url = "https://upload.wikimedia.org/wikipedia/commons/0/07/Ducati_red_logo.svg" },
    @{ Name = "harley_davidson"; Url = "https://upload.wikimedia.org/wikipedia/commons/d/d7/Harley-Davidson_logo.svg" },
    @{ Name = "husqvarna"; Url = "https://upload.wikimedia.org/wikipedia/commons/3/36/Husqvarna_Motorcycles_Logo.svg" },
    @{ Name = "indian"; Url = "https://upload.wikimedia.org/wikipedia/commons/8/82/Indian_Motorcycle_logo.svg" },
    @{ Name = "aprilia"; Url = "https://upload.wikimedia.org/wikipedia/commons/2/23/Aprilia_logo.svg" },
    @{ Name = "benelli"; Url = "https://upload.wikimedia.org/wikipedia/commons/f/fa/Benelli_logo.svg" },
    @{ Name = "mv_agusta"; Url = "https://upload.wikimedia.org/wikipedia/commons/c/c5/MV_Agusta_logo.svg" },
    @{ Name = "moto_guzzi"; Url = "https://upload.wikimedia.org/wikipedia/commons/2/26/Moto_Guzzi_logo.svg" },
    @{ Name = "jawa"; Url = "https://upload.wikimedia.org/wikipedia/commons/1/1a/Jawa_Motors_logo.svg" }
)

$outDir = "frontend\public\brands"
if (-Not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir
}

$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    "Accept" = "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8"
}

foreach ($logo in $logos) {
    $outFile = Join-Path $outDir ($logo.Name + ".svg")
    Write-Host "Downloading $($logo.Name)..."
    try {
        Invoke-WebRequest -Uri $logo.Url -OutFile $outFile -Headers $headers -UseBasicParsing
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "Failed to download $($logo.Name): $($_.Exception.Message)"
    }
}

Write-Host "Done downloading SVGs."
