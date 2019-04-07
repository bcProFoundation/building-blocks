import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceType } from './service-type.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: MongoRepository<ServiceType>,
  ) {}

  async save(params) {
    return await this.serviceTypeRepository.save(params);
  }

  async find(): Promise<ServiceType[]> {
    return await this.serviceTypeRepository.find();
  }

  async findOne(params) {
    return await this.serviceTypeRepository.findOne(params);
  }

  async update(query, params) {
    return await this.serviceTypeRepository.update(query, params);
  }

  async count() {
    return await this.serviceTypeRepository.count();
  }

  async paginate(skip: number, take: number, search: string, order: any) {
    skip = Number(skip);
    take = Number(take);

    const nameExp = new RegExp(search, 'i');
    const $or = ['name', 'uuid'].map(field => {
      const filter = {};
      filter[field] = nameExp;
      return filter;
    });

    const docs = await this.serviceTypeRepository.find({
      skip,
      take,
      order,
      where: { $or },
    });

    const length = await this.serviceTypeRepository.count({ $or });
    return { docs, length, offset: skip ? skip : undefined };
  }

  async deleteMany(params) {
    return await this.serviceTypeRepository.deleteMany(params);
  }
}
