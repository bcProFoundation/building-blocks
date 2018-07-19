import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { AuthService } from 'auth/controllers/auth/auth.service';
import { createUserCLI } from 'nestjs-console-connector';

const app = NestFactory.create(AppModule);
createUserCLI(app, AuthService);
