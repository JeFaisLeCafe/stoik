import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function main() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin =
    process.env.CORS_ORIGIN || "http://localhost:5173";
  app.enableCors({
    origin: corsOrigin.includes(",") ? corsOrigin.split(",") : corsOrigin,
  });
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);
  console.log(`Server running at http://localhost:${port}`);
}

main();
