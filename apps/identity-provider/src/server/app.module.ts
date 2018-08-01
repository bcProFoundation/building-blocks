import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { AngularUniversalModule } from './angular-universal/angular-universal.module';

const imports = [
  TypeOrmModule.forRoot(TYPEORM_CONNECTION),
  ModelsModule,
  AuthModule,
];

if (process.env.NODE_ENV === 'production') {
  imports.push(AngularUniversalModule.forRoot());
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
