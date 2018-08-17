import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async save(params) {
    return await this.roleRepository.save(params);
  }

  async findOne(params) {
    return await this.roleRepository.findOne(params);
  }

  async clear() {
    return await this.roleRepository.clear();
  }
}
