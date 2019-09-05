import { Injectable, Inject } from '@nestjs/common';
import { SCOPE } from './scope.schema';
import { Scope } from './scope.interface';
import { invalidScopeException } from '../../../common/filters/exceptions';
import { Model } from 'mongoose';

@Injectable()
export class ScopeService {
  constructor(@Inject(SCOPE) private readonly scopeModel: Model<Scope>) {}

  async save(params) {
    params.name = params.name.toLowerCase().trim();
    const checkScope = await this.findOne({ name: params.name });
    if (checkScope) throw invalidScopeException;
    const createdScope = new this.scopeModel(params);
    return await createdScope.save();
  }

  async findOne(params) {
    return await this.scopeModel.findOne(params);
  }

  public async clear() {
    return await this.scopeModel.deleteMany({});
  }

  getModel() {
    return this.scopeModel;
  }

  public async find(params) {
    return await this.scopeModel.find(params);
  }

  async insertMany(scopes: { name: string; description?: string }[]) {
    return await this.scopeModel.insertMany(scopes);
  }
}
