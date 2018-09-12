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
import { AuthData } from '../auth-data/auth-data.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(AuthData)
    private readonly authDataRepository: Repository<AuthData>,
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
      const twoFactorTempSecret = await this.authDataRepository.findOne({
        uuid: user.twoFactorTempSecret,
      });
      const base32secret = twoFactorTempSecret.password;
      const verified = speakeasy.totp({
        secret: base32secret,
        encoding: 'base32',
      });
      if (verified === otp) {
        const sharedSecret = new AuthData();
        sharedSecret.password = twoFactorTempSecret.password;
        sharedSecret.save();

        user.sharedSecret = sharedSecret.uuid;
        user.enable2fa = true;

        delete user.twoFactorTempSecret;
        twoFactorTempSecret.remove();

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

      // Save secret on AuthData
      const authData = new AuthData();
      authData.password = secret.base32;
      authData.save();

      user.twoFactorTempSecret = authData.uuid;
      user.save();

      const otpAuthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: user.email,
        period: 30,
      });
      const qrImage = await QRCode.toDataURL(otpAuthUrl);
      return {
        user: {
          uuid: user.uuid,
          email: user.email,
          phone: user.phone,
        },
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
}
