# 영단어 플래시카드 배포 스크립트 (PowerShell)
$ErrorActionPreference = "Stop"

Write-Host "========================================"
Write-Host "  영단어 플래시카드 배포 스크립트"
Write-Host "========================================"
Write-Host ""

# 1. 빌드
Write-Host "[1/4] 빌드 중..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[오류] 빌드 실패!" -ForegroundColor Red
    exit 1
}
Write-Host "[완료] 빌드 성공!" -ForegroundColor Green
Write-Host ""

# 2. Vercel 배포
Write-Host "[2/4] Vercel 배포 중..." -ForegroundColor Cyan
$output = vercel --prod 2>&1
$output | ForEach-Object { Write-Host $_ }

# 배포 URL 추출
$deployUrl = $output | Select-String -Pattern "https://isw-eword-[a-z0-9]+-insu-shims-projects\.vercel\.app" |
    ForEach-Object { $_.Matches.Value } | Select-Object -First 1

if (-not $deployUrl) {
    Write-Host "[경고] 배포 URL을 찾을 수 없습니다. 최신 배포를 검색합니다..." -ForegroundColor Yellow
    $lsOutput = vercel ls 2>&1
    $deployUrl = $lsOutput | Select-String -Pattern "https://isw-eword-[a-z0-9]+-insu-shims-projects\.vercel\.app" |
        ForEach-Object { $_.Matches.Value } | Select-Object -First 1
}

Write-Host ""
Write-Host "[완료] 배포 성공!" -ForegroundColor Green
Write-Host "배포 URL: $deployUrl" -ForegroundColor Yellow
Write-Host ""

# 3. Alias 설정
Write-Host "[3/4] Alias 설정 중..." -ForegroundColor Cyan
if ($deployUrl) {
    vercel alias $deployUrl isw-eword.vercel.app
    Write-Host "[완료] Alias 설정 성공!" -ForegroundColor Green
} else {
    Write-Host "[오류] 배포 URL을 찾을 수 없습니다!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# 4. 배포 확인
Write-Host "[4/4] 배포 확인 중..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
try {
    $response = Invoke-WebRequest -Uri "https://isw-eword.vercel.app/" -Method Head -UseBasicParsing
    $status = $response.StatusCode
} catch {
    $status = $_.Exception.Response.StatusCode.value__
}
Write-Host "HTTP 상태: $status"

Write-Host ""
Write-Host "========================================"
if ($status -eq 200) {
    Write-Host "  배포 성공!" -ForegroundColor Green
} else {
    Write-Host "  브라우저 캐시를 지워주세요!" -ForegroundColor Yellow
}
Write-Host "  URL: https://isw-eword.vercel.app"
Write-Host "========================================"
Write-Host ""
Write-Host "브라우저에서 Ctrl+Shift+R 로 새로고침하세요."
Read-Host "엔터를 눌러 종료"
