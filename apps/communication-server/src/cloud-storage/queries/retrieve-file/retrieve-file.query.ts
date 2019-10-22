import { IQuery } from '@nestjs/cqrs';

export class RetrieveFileQuery implements IQuery {
  constructor(
    public readonly fileName: string,
    public readonly storageUuid: string,
    public readonly req: unknown,
    public readonly expiry: number,
  ) {}
}
