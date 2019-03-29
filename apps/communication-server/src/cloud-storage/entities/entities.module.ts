import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage/storage.service';
import { Storage } from './storage/storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  providers: [StorageService],
  exports: [StorageService],
})
export class CloudStorageEntitiesModule {}
