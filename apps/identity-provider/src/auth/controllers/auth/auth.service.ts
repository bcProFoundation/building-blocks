import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { User } from '../../../models/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
  ) {}

  public async signUp(user: CreateUserDto) {
    // save passwords in different separate entities
    const authData = new AuthData();
    const userEntity = new User();
    Object.assign(userEntity, user);
    authData.password = await this.cryptoService.hashPassword(user.password);
    authData.save();
    userEntity.password = Promise.resolve(authData);
    await this.userService.create(userEntity);
  }

  public async logIn(email, password) {
    return await this.userService
      .findOne({ email })
      .then(async user => {
        const userPassword = await user.password;
        return (await this.cryptoService.checkPassword(
          userPassword.password,
          password,
        ))
          ? Promise.resolve(user)
          : Promise.reject(new UnauthorizedException('Invalid password'));
      })
      .catch(err => Promise.reject(err));
  }
}
