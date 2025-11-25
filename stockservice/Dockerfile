# Fichier : StockService/Dockerfile
FROM eclipse-temurin:17-jre-alpine

RUN apk add --no-cache libc6-compat

RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

WORKDIR /app

COPY target/StockService-0.0.1-SNAPSHOT.jar app.jar

RUN chown appuser:appuser app.jar
USER appuser

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]