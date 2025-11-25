# Fichier : LivraisonService/Dockerfile
FROM eclipse-temurin:17-jre-alpine

# Dépendances système (si besoin)
RUN apk add --no-cache libc6-compat

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S appuser && adduser -u 1001 -S appuser -G appuser

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR (généré par Maven)
COPY target/LivraisonService-0.0.1-SNAPSHOT.jar app.jar

# Changer le propriétaire
RUN chown appuser:appuser app.jar
USER appuser

# Exposer le port
EXPOSE 8083

# Lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]