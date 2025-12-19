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

REM 배포 실행 및 URL 캡처
for /f "delims=" %%i in ('vercel --prod 2^>^&1') do (
    echo %%i
    echo %%i | findstr /R "https://isw-eword-.*\.vercel\.app" >nul
    if !errorlevel! equ 0 (
        for /f "tokens=1" %%u in ("%%i") do (
            echo %%u | findstr "https://" >nul
            if !errorlevel! equ 0 set "DEPLOY_URL=%%u"
        )
    )
)

if "!DEPLOY_URL!"=="" (
    echo [경고] 배포 URL을 찾을 수 없습니다. 최신 배포를 검색합니다...
    for /f "tokens=2" %%a in ('vercel ls 2^>^&1 ^| findstr /R "isw-eword-.*Ready.*Production"') do (
        set "DEPLOY_URL=%%a"
        goto :found_url
    )
)
:found_url

echo.
echo [완료] 배포 성공!
echo 배포 URL: !DEPLOY_URL!
echo.

echo [3/4] Alias 설정 중...
if not "!DEPLOY_URL!"=="" (
    vercel alias !DEPLOY_URL! isw-eword.vercel.app
) else (
    echo [오류] 배포 URL을 찾을 수 없습니다!
    pause
    exit /b 1
)
echo [완료] Alias 설정 성공!
echo.

echo [4/4] 배포 확인 중...
for /f %%s in ('curl -s -o nul -w "%%{http_code}" https://isw-eword.vercel.app/') do set "STATUS=%%s"
echo HTTP 상태: !STATUS!

if "!STATUS!"=="200" (
    echo.
    echo ========================================
    echo   배포 성공!
    echo   URL: https://isw-eword.vercel.app
    echo ========================================
) else (
    echo.
    echo [경고] HTTP 상태가 200이 아닙니다. 브라우저 캐시를 지워보세요.
)

echo.
echo 브라우저에서 Ctrl+Shift+R 로 새로고침하세요.
pause
