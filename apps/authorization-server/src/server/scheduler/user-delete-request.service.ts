import { Injectable, OnModuleInit, HttpService } from '@nestjs/common';
import * as Bull from 'bull';
import { BullOptions } from './bull-queue.options';
import { ConfigService } from '../config/config.service';
import { ClientService } from '../models/client/client.service';
import { retry } from 'rxjs/operators';

export const USER_DELETE_REQUEST = 'user_delete_request';

@Injectable()
export class UserDeleteRequestService implements OnModuleInit {
  protected queue: Bull.Queue;

  constructor(
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    const bullOptions: BullOptions = {
      redis: {
        host: this.configService.get('BULL_QUEUE_REDIS_HOST'),
        port: Number(this.configService.get('BULL_QUEUE_REDIS_PORT')),
      },
    };
    configService.get('BULL_QUEUE_REDIS_PORT');
    this.queue = new Bull(USER_DELETE_REQUEST, bullOptions);
  }

  async onModuleInit() {
    await this.defineQueueProcess();
    await this.informClients('123');
  }

  async defineQueueProcess() {
    this.queue.process(USER_DELETE_REQUEST, async (job, done) => {
      const clientModel = this.clientService.getModel();
      const clients = await clientModel.find().exec();
      for (const client of clients) {
        if (client.userDeleteEndpoint) {
          const baseEncodedCred = Buffer.from(
            client.clientId + ':' + client.clientSecret,
          ).toString('base64');
          this.http
            .post(
              client.userDeleteEndpoint,
              {
                message: job.data.message,
                user: job.data.uuid,
              },
              {
                headers: {
                  Authorization: 'Basic ' + baseEncodedCred,
                },
              },
            )
            .pipe(retry(3))
            .subscribe();
        }
      }
      done(null, job.id);
    });
  }

  async informClients(uuid) {
    const { id, data } = await this.queue.add(USER_DELETE_REQUEST, {
      message: USER_DELETE_REQUEST,
      uuid,
    });
    return { id, data };
  }
}
