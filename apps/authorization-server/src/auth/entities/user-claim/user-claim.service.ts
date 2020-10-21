import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { USER_CLAIM } from './user-claim.schema';
import { UserClaim } from './user-claim.interface';

@Injectable()
export class UserClaimService {
  constructor(
    @Inject(USER_CLAIM)
    private readonly userClaimModel: Model<UserClaim>,
  ) {}

  async save(params) {
    const userClaim = new this.userClaimModel(params);
    return await userClaim.save();
  }

  async findOne(params) {
    return await this.userClaimModel.findOne(params);
  }

  async find(params?) {
    return await this.userClaimModel.find(params);
  }

  async clear() {
    return await this.userClaimModel.deleteMany({});
  }

  async getAll() {
    return await this.userClaimModel.find().exec();
  }

  async deleteMany(params) {
    return await this.userClaimModel.deleteMany(params);
  }

  async deleteOne(params) {
    return await this.userClaimModel.deleteOne(params);
  }

  async remove(claim: UserClaim) {
    return await claim.remove();
  }

  async updateOne(query, params) {
    return await this.userClaimModel.updateOne(query, params);
  }

  async list(uuid: string, offset: number = 0, limit: number = 20) {
    const data = this.userClaimModel
      .find({ uuid })
      .skip(Number(offset))
      .limit(Number(limit));

    return {
      docs: await data.exec(),
      length: await this.userClaimModel.countDocuments({ uuid }),
      offset: Number(offset),
    };
  }
}
