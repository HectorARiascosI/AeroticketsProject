@echo off
REM ======================================================
REM === SCRIPT INTELIGENTE Y AUTOCORRECTIVO PARA GITHUB ===
REM ======================================================

setlocal enabledelayedexpansion
color 0A
title 🚀 Git Auto Push - AeroticketsProject

REM === Cambiar al repositorio ===
cd /d "C:\Users\Familia\Desktop\AeroticketsProject" || (
    echo ❌ No se pudo acceder al directorio del repositorio.
    pause
    exit /b
)

REM === Verificar instalación de Git ===
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git no está instalado o no se encuentra en el PATH.
    echo 👉 Instálalo desde https://git-scm.com/downloads
    pause
    exit /b
)

REM === Mostrar ubicación y rama ===
echo 📂 Repositorio: %cd%
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set branch=%%b
echo 🌿 Rama actual: %branch%

REM === Revisar si hay cambios o archivos sin seguimiento ===
git add -A
for /f "tokens=*" %%t in ('powershell -command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set fecha=%%t
set msg=auto-commit %fecha%

REM === Confirmar si hay algo para commit ===
git diff --cached --quiet
if errorlevel 1 (
    echo 📝 Creando commit: "%msg%"
    git commit -m "%msg%"
) else (
    echo ⚠️ No hay nuevos cambios para confirmar.
)

REM === Subir al remoto ===
echo 🚀 Subiendo cambios a origin/%branch% ...
git push origin %branch%
if errorlevel 1 (
    echo ❌ Error al subir cambios. Revisa tu conexión o credenciales.
    pause
    exit /b
)

REM === Éxito ===
echo =====================================================
echo ✅ Cambios subidos correctamente a GitHub
echo 🌿 Rama: %branch%
echo =====================================================
pause
exit /b