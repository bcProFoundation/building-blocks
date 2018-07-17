import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';
import { AuthModule } from 'auth/auth.module';
import { ModelsModule } from 'models/models.module';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';
// import { ServerSideRenderingMiddleware } from 'auth/middlewares/server-side-rendering.middleware';

const config = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot(config.getORMConfig()),
    ConfigModule,
    ModelsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(ServerSideRenderingMiddleware).forRoutes(AppController);
  }
}
