FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY target/eureka-server-*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]