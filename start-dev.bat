@echo off
echo Starting Vignes.Vibe Blog Development Environment...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

echo Building blog...
npm run build
echo.

echo Starting development server...
echo Your blog will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm run serve
