@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   영단어 플래시카드 배포 스크립트
echo ========================================
echo.

echo [1/4] 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo [오류] 빌드 실패!
    pause
    exit /b 1
)
echo [완료] 빌드 성공!
echo.

echo [2/4] Vercel 배포 중...
set "DEPLOY_URL="
for /f "tokens=*" %%i in ('vercel --prod 2^>^&1') do (
    echo %%i
    echo %%i | findstr /C:"isw-eword-" /C:".vercel.app" >nul
    if !errorlevel! equ 0 (
        for /f "tokens=*" %%u in ('echo %%i ^| findstr "https://isw-eword-"') do (
            set "DEPLOY_URL=%%u"
        )
    )
)

REM 배포 URL 추출
for /f "tokens=*" %%u in ('vercel ls 2^>^&1 ^| findstr "isw-eword-" ^| findstr "Ready" ^| head -1') do (
    for /f "tokens=2" %%a in ("%%u") do set "DEPLOY_URL=%%a"
)

echo [완료] 배포 성공!
echo.

echo [3/4] Alias 설정 중 (isw-eword.vercel.app)...
vercel alias isw-eword.vercel.app
if %errorlevel% neq 0 (
    echo [경고] 기본 alias 실패, 최신 배포로 재시도...
    for /f "tokens=2" %%a in ('vercel ls 2^>^&1 ^| findstr "Ready" ^| findstr "Production"') do (
        echo 배포 URL: %%a
        vercel alias %%a isw-eword.vercel.app
        goto :alias_done
    )
)
:alias_done
echo [완료] Alias 설정 성공!
echo.

echo [4/4] 배포 확인 중...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" https://isw-eword.vercel.app/
echo.

echo ========================================
echo   배포 완료!
echo   URL: https://isw-eword.vercel.app
echo ========================================
echo.
echo 브라우저에서 Ctrl+Shift+R 로 새로고침하세요.
pause
