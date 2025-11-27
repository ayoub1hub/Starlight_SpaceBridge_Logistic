@echo off
title Microservices Launcher

echo ============================================
echo   STARTING SPRING MICRO-SERVICES SUITE
echo ============================================

REM --- Open Eureka ---
echo Starting Eureka server...
start cmd /k "cd eureka_server && mvnw spring-boot:run"

REM --- Open API Gateway ---
echo Starting API Gateway...
start cmd /k "cd ApiGateway && mvnw spring-boot:run"

REM --- Open Livraison Service ---
echo Starting Livraison Service...
start cmd /k "cd LivraisonService && mvnw spring-boot:run"

REM --- Open Stock Service ---
echo Starting Stock Service...
start cmd /k "cd stockservice && mvnw spring-boot:run"

echo ============================================
echo   All services started in separate windows.
echo ============================================
pause