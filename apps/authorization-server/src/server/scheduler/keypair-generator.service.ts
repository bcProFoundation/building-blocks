import { Injectable } from '@angular/core';
import { OnApplicationBootstrap } from '@nestjs/common';
import * as Agenda from 'agenda';
import { AgendaService } from './agenda.service';
import { OIDCKeyService } from '../models/oidc-key/oidc-key.service';

@Injectable()
export class KeyPairGeneratorService implements OnApplicationBootstrap {
  constructor(
    private readonly oidcKeyService: OIDCKeyService,
    private readonly agendaService: AgendaService,
  ) {}

  async onApplicationBootstrap() {
    this.generateKeyPair();
    await this.agendaService.every('5 seconds', 'generate_keypair');
  }

  generateKeyPair() {
    this.agendaService.define(
      'generate_keypair',
      async (job: Agenda.Job, done: (err?: Error) => void) => {
        /** Generate Key only once
         * No done() callback used
         * https://github.com/agenda/agenda#definejobname-options-fn
         */
        await this.oidcKeyService.generateKey();
      },
    );
  }
}
