import { Injectable } from '@angular/core';
import { BearerTokenService } from '../models/bearer-token/bearer-token.service';
import { OnApplicationBootstrap } from '@nestjs/common';
import * as Agenda from 'agenda';
import { AgendaService } from './agenda.service';

@Injectable()
export class TokenSchedulerService implements OnApplicationBootstrap {
  constructor(
    private readonly bearerTokenService: BearerTokenService,
    private readonly agendaService: AgendaService,
  ) {}

  async onApplicationBootstrap() {
    this.defineDeleteTokens();
    await this.agendaService.every('60 minutes', 'delete_expired_tokens');
  }

  defineDeleteTokens() {
    this.agendaService.define(
      'delete_expired_tokens',
      async (job: Agenda.Job, done: (err?: Error) => void) => {
        // Delete Expired Tokens with No Refresh Token
        const tokens = await this.bearerTokenService.getAll();
        for (const token of tokens) {
          const exp = new Date(
            token.creation.getTime() + token.expiresIn * 1000,
          );
          if (exp.valueOf() < new Date().valueOf() && !token.refreshToken) {
            token.remove();
          }
        }
        done();
      },
    );
  }
}
