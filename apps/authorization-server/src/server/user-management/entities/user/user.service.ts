import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  invalidUserException,
  userAlreadyExistsException,
} from '../../../common/filters/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from './user.schema';
import { User } from './user.interface';
import { i18n } from '../../../i18n/i18n.config';
import { ADMINISTRATOR } from '../../../constants/app-strings';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER) private readonly userModel: Model<User>) {}

  public async save(params) {
    let localUser: User;

    if (params.email) {
      localUser = await this.findOne({ email: params.email });
      if (localUser) throw userAlreadyExistsException;
    }

    if (params.phone) {
      localUser = await this.findOne({ phone: params.phone });
      if (localUser) throw userAlreadyExistsException;
    }

    const createdUser = new this.userModel(params);
    return await createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  public async findOne(params): Promise<User> {
    return await this.userModel.findOne(params);
  }

  public async delete(params): Promise<any> {
    await this.userModel.deleteOne(params);
    return { message: i18n.__('User deleted') };
  }

  public async find() {
    return await this.userModel.find().exec();
  }

  public async deleteByEmail(email) {
    return await this.userModel.deleteOne({ email });
  }

  async findUserByEmailOrPhone(emailOrPhone: string) {
    let user;
    user = await this.findOne({ email: emailOrPhone });
    if (!user) user = await this.findOne({ phone: emailOrPhone });
    if (!user) throw invalidUserException;
    return user;
  }

  async checkAdministrator(uuid) {
    const user: User = await this.findOne({ uuid });
    if (user.roles.includes(ADMINISTRATOR)) {
      return true;
    }
    return false;
  }

  getModel() {
    return this.userModel;
  }
}
