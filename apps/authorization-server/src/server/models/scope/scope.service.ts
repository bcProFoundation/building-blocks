import { Injectable } from '@nestjs/common';
import { SCOPE } from './scope.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Scope } from '../interfaces/scope.interface';
import { invalidScopeException } from '../../auth/filters/exceptions';
import { Model } from 'mongoose';

@Injectable()
export class ScopeService {
  constructor(@InjectModel(SCOPE) private readonly scopeModel: Model<Scope>) {}

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
}
