# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build

WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy the source code
COPY src src

# Package the application, skipping tests
RUN ./mvnw package -DskipTests

# Stage 2: Create the final, smaller image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /app/target/prime-wraps-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Use doppler run to inject secrets and run the application
CMD ["doppler", "run", "--", "java", "-jar", "app.jar"]