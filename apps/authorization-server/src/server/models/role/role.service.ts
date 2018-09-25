import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ROLE } from './role.schema';
import { Role } from '../interfaces/role.interface';
import { invalidRoleException } from '../../auth/filters/exceptions';

@Injectable()
export class RoleService {
  constructor(@InjectModel(ROLE) private readonly roleModel: Model<Role>) {}

  async save(params) {
    params.name = params.name.toLowerCase().trim();
    const checkRole = await this.findOne({ name: params.name });
    if (checkRole) throw invalidRoleException;
    const createdRole = new this.roleModel(params);
    return await createdRole.save();
  }

  async findOne(params) {
    return await this.roleModel.findOne(params);
  }

  async clear() {
    return await this.roleModel.deleteMany({});
  }
}
