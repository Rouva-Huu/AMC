
# Стадия сборки
FROM gradle:jdk21 AS builder
WORKDIR /app
COPY . .
RUN gradle build -x test

FROM openjdk:21-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]