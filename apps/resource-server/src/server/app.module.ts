import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from 'models/models.module';
import { ConfigModule } from 'config/config.module';
import { ConfigService } from 'config/config.service';

const config = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forRoot(config.getConfig('ormconfig')),
    AuthModule,
    ModelsModule,
    ConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
