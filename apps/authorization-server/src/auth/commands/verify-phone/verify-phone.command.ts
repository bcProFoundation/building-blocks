import { ICommand } from '@nestjs/cqrs';
import { Request } from 'express';

export class VerifyPhoneCommand implements ICommand {
  constructor(
    public readonly userUuid: string,
    public readonly otp: string,
    public readonly request?: Request,
  ) {}
}
