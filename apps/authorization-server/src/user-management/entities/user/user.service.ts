import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { invalidUserException } from '../../../common/filters/exceptions';
import { USER } from './user.schema';
import { User } from './user.interface';
import { i18n } from '../../../i18n/i18n.config';
import { ADMINISTRATOR } from '../../../constants/app-strings';

@Injectable()
export class UserService {
  constructor(@Inject(USER) private readonly userModel: Model<User>) {}

  public async save(params) {
    const createdUser = new this.userModel(params);
    return await createdUser.save();
  }

  public async update(user: User) {
    return await user.save();
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

  public async remove(user: User) {
    return await user.remove();
  }

  public async find(params?) {
    return await this.userModel.find(params).exec();
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

  async getAuthorizedUser(uuid: string) {
    const user = await this.findOne({ uuid });

    return {
      disabled: user.disabled,
      roles: user.roles,
      enable2fa: user.enable2fa,
      deleted: user.deleted,
      enablePasswordLess: user.enablePasswordLess,
      email: user.email,
      phone: user.phone,
      name: user.name,
      uuid: user.uuid,
      creation: user.creation,
      isPasswordSet: user.password ? true : false,
    };
  }

  getUserWithoutSecrets(user: User) {
    user.password = undefined;
    user.sharedSecret = undefined;
    user.twoFactorTempSecret = undefined;
    user.otpPeriod = undefined;
    return user;
  }

  getUserWithoutIdentity(user: User) {
    user.name = undefined;
    user.email = undefined;
    user.phone = undefined;
    return user;
  }

  getUserWithoutMetaData(user: User) {
    user.deleted = undefined;
    user.uuid = undefined;
    user.creation = undefined;
    user.modified = undefined;
    return user;
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
      query.$or = ['email', 'phone', 'name', 'uuid'].map(field => {
        const out = {};
        out[field] = nameExp;
        return out;
      });
    }

    const data = this.userModel
      .find(query)
      .skip(Number(offset))
      .limit(Number(limit))
      .sort(sortQuery);

    return {
      docs: await data.exec(),
      length: await this.userModel.countDocuments(query),
      offset: Number(offset),
    };
  }
}
