import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { USER_DELETED } from '../../constants/messages';
import {
  invalidUserException,
  twoFactorEnabledException,
  twoFactorNotEnabledException,
  invalidOTPException,
} from '../../auth/filters/exceptions';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async save(user) {
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async findOne(params): Promise<any> {
    return await this.userRepository.findOne(params);
  }

  public async delete(params): Promise<any> {
    return await this.findOne(params).then(user =>
      user.remove().then(() => Promise.resolve({ message: USER_DELETED })),
    );
  }

  public async find() {
    return await this.userRepository.find();
  }

  public async deleteByEmail(email) {
    return await this.userRepository.delete({ email });
  }

  async verify2fa(email: string, otp: string) {
    const user: User = await this.findOne({ email });
    if (!otp) throw invalidOTPException;
    if (user.twoFactorTempSecret) {
      const base32secret = user.twoFactorTempSecret;
      const verified = speakeasy.totp({
        secret: base32secret,
        encoding: 'base32',
      });
      if (verified === otp) {
        user.sharedSecret = user.twoFactorTempSecret;
        user.enable2fa = true;
        delete user.twoFactorTempSecret;
        user.save();

        return {
          user: {
            uuid: user.uuid,
            email: user.email,
            phone: user.phone,
          },
        };
      }
    }
    throw twoFactorNotEnabledException;
  }

  async initializeMfa(email: string, restart: boolean = false) {
    const user: User = await this.findOne({ email });
    if (restart || !user.enable2fa) {
      // TODO: setup issuer from server url
      const secret = speakeasy.generateSecret({ name: user.email });
      user.twoFactorTempSecret = secret.base32;
      user.save();
      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: 'AS_OTP',
        period: 30,
      });
      const qrImage = await QRCode.toDataURL(otpAuthUrl);
      // return {
      //   user: {
      //     uuid: user.uuid,
      //     email: user.email,
      //     phone: user.phone,
      //   },
      //   qrImage,
      //   key: user.twoFactorTempSecret,
      // }
      return `<img src='${qrImage}' />`;
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
}
