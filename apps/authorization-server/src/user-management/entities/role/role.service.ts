import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { ROLE } from './role.schema';
import { Role } from './role.interface';

@Injectable()
export class RoleService {
  constructor(@Inject(ROLE) private readonly roleModel: Model<Role>) {}

  async save(params) {
    params.name = params.name.toLowerCase().trim();
    const createdRole = new this.roleModel(params);
    return await createdRole.save();
  }

  async findOne(params) {
    return await this.roleModel.findOne(params);
  }

  async clear() {
    return await this.roleModel.deleteMany({});
  }

  async find(params?) {
    return await this.roleModel.find(params).exec();
  }

  async remove(role: Role) {
    return await role.remove();
  }

  async list(
    offset: number,
    limit: number,
    search: string,
    query: any,
    sortQuery?: any,
  ) {
    if (search) {
      // Search through multiple keys
      // https://stackoverflow.com/a/41390870
      const nameExp = new RegExp(search, 'i');
      query.$or = ['name', 'uuid'].map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.roleModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.roleModel.countDocuments(query),
      offset: Number(offset),
    };
  }
}
