@echo off
REM Start a local web server to test the currency converter app
echo Starting local server...
cd /d "%~dp0"
python -m http.server 8000
pause
