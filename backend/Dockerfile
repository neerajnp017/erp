# ==========================================
# Stage 1: Build the application (Using Corretto)
# ==========================================
FROM maven:3.9-amazoncorretto-17 AS build
WORKDIR /app

# Cache dependencies for faster builds
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Create the final runtime image (Using Corretto Alpine)
# ==========================================
FROM amazoncorretto:17-alpine
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

# EXTREMELY IMPORTANT: Keep the memory limits!
ENV JAVA_OPTS="-Xmx256m -Xms256m"

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar --spring.profiles.active=prod"]
