import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: MongoRepository<Service>,
  ) {}

  async save(params) {
    return await this.serviceRepository.save(params);
  }

  async find(params?): Promise<Service[]> {
    return await this.serviceRepository.find(params);
  }

  async findOne(params) {
    return await this.serviceRepository.findOne(params);
  }

  async update(query, params) {
    return await this.serviceRepository.update(query, params);
  }

  async count() {
    return await this.serviceRepository.count();
  }

  async paginate(
    skip: number,
    take: number,
    search: string,
    order: any,
    type: string,
  ) {
    skip = Number(skip);
    take = Number(take);
    const nameExp = new RegExp(search, 'i');
    const $or = ['name', 'clientId', 'serviceURL', 'type', 'uuid'].map(
      field => {
        const filter = {};
        filter[field] = nameExp;
        return filter;
      },
    );

    const where: { $or?: any; type?: string } = { $or };
    if (type) where.type = type;

    const docs = await this.serviceRepository.find({
      skip,
      take,
      order,
      where,
    });

    const length = await this.serviceRepository.count({ ...where });
    return { docs, length, offset: skip ? skip : undefined };
  }

  async deleteMany(params) {
    return await this.serviceRepository.deleteMany(params);
  }
}
