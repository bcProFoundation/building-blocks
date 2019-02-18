import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Storage } from './storage.entity';
import { DELETED } from '../../../constants/messages';
import { StorageValidationDto } from '../../../cloud-storage/policies';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: MongoRepository<Storage>,
  ) {}

  public async save(params: Storage | StorageValidationDto) {
    const storage = new Storage();
    Object.assign(storage, params);
    return await this.storageRepository.save(storage);
  }

  async findAll(): Promise<Storage[]> {
    return await this.storageRepository.find();
  }

  public async findOne(params): Promise<any> {
    return await this.storageRepository.findOne(params);
  }

  public async delete(params): Promise<any> {
    return await this.findOne(params).then(storage =>
      storage.remove().then(() => Promise.resolve({ message: DELETED })),
    );
  }

  public async list(skip, take) {
    const storage = await this.storageRepository.find({ skip, take });
    return storage;
  }

  public async find(params) {
    return await this.storageRepository.find(params);
  }
}
