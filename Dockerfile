# Build stage
FROM maven:3.9.16-eclipse-temurin-17 AS builder
WORKDIR /app
COPY eelish/pom.xml ./
RUN mvn dependency:go-offline -B
COPY eelish/src ./src
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
EXPOSE 8080
COPY --from=builder /app/target/*.jar /app/*.jar
ENTRYPOINT ["java", "-jar", "/app/*.jar"]
