import { ClientService } from './client.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from 'config/config.service';

@Injectable()
export class ClientFixture implements OnModuleInit {
  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.setupClient();
  }

  async setupClient() {
    let client = await this.clientService.find();
    if (!client.length) {
      client = await this.clientService.save(
        this.configService.getConfig('oauth2client'),
      );
    }
  }
}
