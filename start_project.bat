@echo off
title 🚀 Iniciando Aerotickets Project
color 0a
echo =========================================
echo   🚀 Iniciando Aerotickets (Backend + Frontend)
echo =========================================

REM ==== BACKEND ====
echo [1] Verificando backend...
cd backend

if not exist "target" (
    echo -> No se encontró 'target', compilando con Maven...
    call mvn clean package
) else (
    echo -> Backend ya compilado.
)

echo -> Iniciando Spring Boot...
start cmd /k "cd C:\Users\Familia\Desktop\AeroticketsProject\backend && mvn spring-boot:run"

cd ..

REM ==== FRONTEND ====
echo [2] Verificando frontend...
cd frontend-typescript

if not exist "node_modules" (
    echo -> No se encontró 'node_modules', instalando dependencias...
    call npm install
) else (
    echo -> Dependencias del frontend ya instaladas.
)

echo -> Iniciando servidor Vite...
start cmd /k "cd C:\Users\Familia\Desktop\AeroticketsProject\frontend-typescript && npm run dev"

cd ..

echo =========================================
echo ✅ Todo se ha iniciado correctamente
echo -----------------------------------------
echo 🌐 Backend:  http://localhost:8080
echo 💻 Frontend: http://localhost:5173
echo =========================================
pause