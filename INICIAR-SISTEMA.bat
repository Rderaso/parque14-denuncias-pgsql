@echo off
echo ========================================
echo  SISTEMA PARQUE 14 - POSTGRESQL
echo ========================================
echo.
echo Iniciando backend...
echo.

cd backend
start cmd /k "npm start"

timeout /t 3

echo.
echo Backend iniciado en http://localhost:3001
echo.
echo Abriendo frontend...
echo.

start index-postgres.html

echo.
echo ========================================
echo  SISTEMA INICIADO
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: Abierto en navegador
echo.
echo Presiona cualquier tecla para cerrar...
pause
