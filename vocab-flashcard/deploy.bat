@echo off
chcp 65001 >nul
echo ========================================
echo   영단어 플래시카드 배포 스크립트
echo ========================================
echo.

echo [1/3] 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo 빌드 실패!
    pause
    exit /b 1
)
echo 빌드 완료!
echo.

echo [2/3] Vercel 배포 중...
for /f "tokens=*" %%i in ('vercel --prod 2^>^&1') do (
    echo %%i
    echo %%i | findstr /C:"isw-eword-" >nul && set "DEPLOY_URL=%%i"
)
echo 배포 완료!
echo.

echo [3/3] Alias 설정 중...
vercel alias isw-eword.vercel.app
if %errorlevel% neq 0 (
    echo Alias 설정 실패! 수동으로 설정해주세요.
) else (
    echo Alias 설정 완료!
)
echo.

echo ========================================
echo   배포 완료: https://isw-eword.vercel.app
echo ========================================
pause
