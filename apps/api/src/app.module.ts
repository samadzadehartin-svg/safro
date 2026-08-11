import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ContactModule } from "./contact/contact.module";
import { HealthModule } from "./health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [".env", "../../.env"] }),
    HealthModule,
    ContactModule,
  ],
})
export class AppModule {}
