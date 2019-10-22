import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveFileQuery } from './retrieve-file.query';
import { CloudStorageAggregateService } from '../../aggregates/cloud-storage-aggregate/cloud-storage-aggregate.service';

@QueryHandler(RetrieveFileQuery)
export class RetrieveFileHandler implements IQueryHandler<RetrieveFileQuery> {
  constructor(private readonly handler: CloudStorageAggregateService) {}
  async execute(query: RetrieveFileQuery) {
    const { fileName, storageUuid, req, expiry } = query;
    const url = await this.handler.retrieveFile(
      fileName,
      storageUuid,
      req,
      expiry,
    );
    return { url };
  }
}
