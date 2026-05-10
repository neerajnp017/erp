# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the jar
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# EXTREMELY IMPORTANT: Set memory limits for Free Tier
# This limits Java to 256MB, leaving the rest for the OS/Container
ENV JAVA_OPTS="-Xmx256m -Xms256m"
# Expose the application port
EXPOSE 8080

# Run the application with memory limits and production profile
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=prod"]
