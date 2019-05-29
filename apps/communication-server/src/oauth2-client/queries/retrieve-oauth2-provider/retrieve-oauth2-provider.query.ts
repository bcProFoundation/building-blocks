import { IQuery } from '@nestjs/cqrs';

export class RetrieveOAuth2ProviderQuery implements IQuery {
  constructor(public readonly uuid: string) {}
}
