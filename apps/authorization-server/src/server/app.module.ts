import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        const uri = `mongodb://${config.get('DB_USER')}:${config.get(
          'DB_PASSWORD',
        )}@${config.get('DB_HOST')}/${config.get('DB_NAME')}`;
        return {
          uri,
          useNewUrlParser: true,
        };
      },
      inject: [ConfigService],
    }),
    ModelsModule,
    SchedulerModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
