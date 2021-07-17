import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { retry } from 'rxjs/operators';
import Agenda from 'agenda';
import { ClientService } from '../../../client-management/entities/client/client.service';
import { AGENDA_CONNECTION } from '../../../common/database.provider';

export const USER_DELETE_REQUEST = 'user_delete_request';

@Injectable()
export class UserDeleteRequestService implements OnModuleInit {
  constructor(
    @Inject(AGENDA_CONNECTION)
    private readonly agenda: Agenda,
    private readonly clientService: ClientService,
    private readonly http: HttpService,
  ) {}

  async onModuleInit() {
    await this.defineQueueProcess();
  }

  async defineQueueProcess() {
    this.agenda.define(USER_DELETE_REQUEST, async job => {
      const clients = await this.clientService.findAll();
      for (const client of clients) {
        if (client.userDeleteEndpoint) {
          const baseEncodedCred = Buffer.from(
            client.clientId + ':' + client.clientSecret,
          ).toString('base64');
          this.http
            .post(
              client.userDeleteEndpoint,
              {
                message: job.attrs.data.message,
                user: job.attrs.data.uuid,
              },
              {
                headers: {
                  Authorization: 'Basic ' + baseEncodedCred,
                },
              },
            )
            .pipe(retry(3))
            .subscribe({
              error: error => {
                // TODO: Log Error
              },
            });
        }
      }
    });
  }

  /**
   * Informs Clients on the shared endpoint
   * @param uuid of user deleted
   */
  async informClients(uuid) {
    await this.agenda.now(USER_DELETE_REQUEST, {
      message: USER_DELETE_REQUEST,
      uuid,
    });
  }
}
