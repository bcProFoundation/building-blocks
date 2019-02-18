import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage/storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  providers: [StorageService],
  exports: [StorageService],
})
export class CloudStorageEntitiesModule {}
