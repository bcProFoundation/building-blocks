import { ICommand } from '@nestjs/cqrs';

export class GenerateBearerTokenCommand implements ICommand {
  constructor(
    public readonly client: string,
    public readonly user: string,
    public readonly scope: string[],
    public readonly refresh: boolean = true,
    public readonly idToken: boolean = true,
  ) {}
}
