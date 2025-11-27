FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/LivraisonService-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]