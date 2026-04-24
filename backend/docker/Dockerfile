FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

COPY pom.xml ./
RUN mvn -q -DskipTests dependency:go-offline

COPY src ./src
RUN mvn -q -DskipTests clean package && JAR_FILE=$(ls target/*.jar | grep -v 'original' | head -n 1) && cp "$JAR_FILE" target/app.jar

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/target/app.jar ./app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]
