# Stage 1: Build the application
FROM maven:3.9.6-eclipse-temurin-17 AS build

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
RUN apk update && apk add --no-cache 'libxml2>=2.13.4-r6'

WORKDIR /app

# Copy the packaged jar from the build stage
COPY --from=build /app/target/prime-wraps-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# Install Doppler CLI
RUN apk add --no-cache curl
RUN curl -sLf --retry 3 --retry-delay 2 https://downloads.doppler.com/cli/install.sh | sh

# Use doppler run to inject secrets and run the application
CMD ["doppler", "run", "--", "java", "-jar", "app.jar"]