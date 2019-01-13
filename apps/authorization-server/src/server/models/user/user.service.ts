import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  invalidUserException,
  twoFactorEnabledException,
  twoFactorNotEnabledException,
  invalidOTPException,
  userAlreadyExistsException,
} from '../../auth/filters/exceptions';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from './user.schema';
import { AUTH_DATA } from '../auth-data/auth-data.schema';
import { User } from './user.interface';
import { AuthData } from '../auth-data/auth-data.interface';
import { i18n } from '../../i18n/i18n.config';
import { ADMINISTRATOR } from '../../constants/app-strings';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER) private readonly userModel: Model<User>,
    @InjectModel(AUTH_DATA) private readonly authDataModel: Model<AuthData>,
  ) {}

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

  async getUserSaltedHashPassword(uuid: string) {
    const user = await this.findOne({ uuid });
    const authData = await this.authDataModel.findOne({ uuid: user.password });
    return authData;
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

  async verify2fa(uuid: string, otp: string) {
    const user = await this.findOne({ uuid });
    if (!otp) throw invalidOTPException;
    if (user.twoFactorTempSecret) {
      const twoFactorTempSecret = await this.authDataModel.findOne({
        uuid: user.twoFactorTempSecret,
      });
      const base32secret = twoFactorTempSecret.password;
      const verified = speakeasy.totp({
        secret: base32secret,
        encoding: 'base32',
      });
      if (verified === otp) {
        const sharedSecret: AuthData = new this.authDataModel();
        sharedSecret.password = twoFactorTempSecret.password;
        await sharedSecret.save();

        user.sharedSecret = sharedSecret.uuid;
        user.enable2fa = true;

        user.twoFactorTempSecret = null;
        await twoFactorTempSecret.remove();

        await user.save();

        return {
          user: {
            uuid: user.uuid,
            email: user.email,
            phone: user.phone,
          },
        };
      } else throw twoFactorNotEnabledException;
    }
  }

  async initializeMfa(uuid: string, restart: boolean = false) {
    const user: User = await this.findOne({ uuid });

    // Disable 2FA for admin in env staging
    if (
      process.env.NODE_ENV === 'staging' &&
      user.roles.includes(ADMINISTRATOR)
    ) {
      return { environment: process.env.NODE_ENV };
    }

    if (restart || !user.enable2fa) {
      // TODO: setup issuer from server url
      const secret = speakeasy.generateSecret({ name: user.email });
      // Save secret on AuthData

      if (user.twoFactorTempSecret) {
        const twoFactorTempSecret = await this.authDataModel.findOne({
          uuid: user.twoFactorTempSecret,
        });
        if (twoFactorTempSecret) await twoFactorTempSecret.remove();
        user.twoFactorTempSecret = null;
      }

      const authData: AuthData = new this.authDataModel();
      authData.password = secret.base32;
      await authData.save();
      user.twoFactorTempSecret = authData.uuid;
      await user.save();

      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: user.email,
        period: 30,
      });

      const qrImage = await QRCode.toDataURL(otpAuthUrl);

      return {
        qrImage,
        // shared key from AuthData
        key: authData.password,
      };
    } else {
      throw twoFactorEnabledException;
    }
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

  async disable2fa(uuid: string) {
    const user = await this.findOne({ uuid });
    if (!user.enable2fa) throw twoFactorNotEnabledException;

    user.enable2fa = false;

    const twoFactorTempSecret = await this.authDataModel.findOne({
      uuid: user.twoFactorTempSecret,
    });
    if (twoFactorTempSecret) await twoFactorTempSecret.remove();

    const sharedSecret = await this.authDataModel.findOne({
      uuid: user.sharedSecret,
    });
    if (sharedSecret) await sharedSecret.remove();

    user.twoFactorTempSecret = null;
    user.sharedSecret = null;
    await user.save();
    return { message: i18n.__('2FA Disabled') };
  }

  getModel() {
    return this.userModel;
  }
}
