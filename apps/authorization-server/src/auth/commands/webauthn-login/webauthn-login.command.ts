import { ICommand } from '@nestjs/cqrs';
import { Request } from 'express';

export class WebAuthnLoginCommand implements ICommand {
  constructor(public readonly req: Request) {}
}
