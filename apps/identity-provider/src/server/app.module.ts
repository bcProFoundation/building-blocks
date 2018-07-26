import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';

import { SERVER_MAIN_JS } from './constants/filesystem';
import { TYPEORM_CONNECTION } from './models/typeorm.connection';
import { applyDomino, AngularUniversalModule } from './angular-universal';
import { join } from 'path';

const BROWSER_DIR = join(process.cwd(), 'dist', 'identity-provider');

const imports = [
  TypeOrmModule.forRoot(TYPEORM_CONNECTION),
  ModelsModule,
  AuthModule,
];

if (process.env.NODE_ENV === 'production') {
  applyDomino(global, join(BROWSER_DIR, 'index.html'));
  imports.push(
    AngularUniversalModule.forRoot({
      viewsPath: BROWSER_DIR,
      bundle: require(SERVER_MAIN_JS),
    }),
  );
}

@Module({
  imports,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
