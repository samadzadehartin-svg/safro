import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = Number(process.env.PORT ?? 4000);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("AURA Paris API")
    .setDescription("Backend API for the luxury Paris landing page")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
  console.log(`API running at http://localhost:${port}/api`);
  console.log(`Swagger at http://localhost:${port}/docs`);
}

bootstrap();
