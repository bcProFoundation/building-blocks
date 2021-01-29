import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { EmailAccountService } from '../../../email/entities/email-account/email-account.service';
import { EmailMessageAuthServerDto } from './email-message-authserver-dto';
import { SendSystemEmailCommand } from '../../../email/commands/send-system-email/send-system-email.command';
import { TokenCache } from '../../../auth/entities/token-cache/token-cache.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly emailAccount: EmailAccountService,
    private readonly commandBus: CommandBus,
  ) {}

  async findOne(params) {
    return await this.emailAccount.findOne(params);
  }

  async sendSystemMessage(payload: EmailMessageAuthServerDto) {
    return await this.commandBus.execute(new SendSystemEmailCommand(payload));
  }

  async sendTrustedClientSystemMessage(
    payload: EmailMessageAuthServerDto,
    token: TokenCache,
  ) {
    if (!token.trustedClient) {
      throw new ForbiddenException();
    }

    return await this.commandBus.execute(new SendSystemEmailCommand(payload));
  }

  async deleteEmailAccount(uuid: string) {
    const email = await this.findOne({ uuid });
    if (!email) {
      throw new NotFoundException({ EmailAccountNotFound: uuid });
    }
    await this.emailAccount.delete({ uuid });
    return { deleted: uuid };
  }
}
