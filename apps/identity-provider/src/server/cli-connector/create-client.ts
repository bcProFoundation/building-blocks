import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { ClientService } from 'models/client/client.service';
import { createIDPClientCLI } from 'nestjs-console-connector';

const app = NestFactory.create(AppModule);
createIDPClientCLI(app, ClientService);
