import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { SendLoginOTPCommand } from './send-login-otp.command';
import { OTPAggregateService } from '../../aggregates/otp-aggregate/otp-aggregate.service';
import { twoFactorNotEnabledException } from '../../../common/filters/exceptions';

@CommandHandler(SendLoginOTPCommand)
export class SendLoginOTPHandler
  implements ICommandHandler<SendLoginOTPCommand> {
  constructor(private readonly otpAggregate: OTPAggregateService) {}
  async execute(command: SendLoginOTPCommand) {
    const { user } = command;
    if (!user.enable2fa) throw twoFactorNotEnabledException;
    await this.otpAggregate.sendLoginOTP(user);
    return user;
  }
}
