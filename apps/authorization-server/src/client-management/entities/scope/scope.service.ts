import { Injectable, Inject } from '@nestjs/common';
import { SCOPE } from './scope.schema';
import { Scope } from './scope.interface';
import { Model } from 'mongoose';

@Injectable()
export class ScopeService {
  constructor(@Inject(SCOPE) private readonly scopeModel: Model<Scope>) {}

  async save(params) {
    const createdScope = new this.scopeModel(params);
    return await createdScope.save();
  }

  async findOne(params) {
    return await this.scopeModel.findOne(params);
  }

  public async clear() {
    return await this.scopeModel.deleteMany({});
  }

  async remove(scope: Scope) {
    return await scope.remove();
  }

  public async find(params) {
    return await this.scopeModel.find(params);
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
      query.$or = ['name', 'description', 'uuid'].map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.scopeModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.scopeModel.countDocuments(query),
      offset: Number(offset),
    };
  }

  async insertMany(scopes: { name: string; description?: string }[]) {
    return await this.scopeModel.insertMany(scopes);
  }
}
