@echo off
REM Frontend production build script for VM deployment (Windows)

echo Building frontend for production...

REM Build the frontend (uses relative paths for API when deployed on same server)
call npm run build

if %ERRORLEVEL% EQU 0 (
    echo Frontend build completed successfully
    echo Build output: dist/
) else (
    echo Frontend build failed
    exit /b 1
)

