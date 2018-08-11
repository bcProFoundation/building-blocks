import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { CreateUserDto } from '../../../models/user/create-user.dto';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { User } from '../../../models/user/user.entity';
import { INVALID_PASSWORD } from '../../../constants/messages';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
    private readonly authDataService: AuthDataService,
  ) {}

  public async signUp(user) {
    const userEntity = new User();
    userEntity.name = user.name;
    userEntity.email = user.email;

    const authData = new AuthData();
    authData.password = await this.cryptoService.hashPassword(user.password);
    userEntity.password = await this.authDataService.save(authData);

    await this.userService.save(userEntity);
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
          : Promise.reject(new UnauthorizedException(INVALID_PASSWORD));
      })
      .catch(err => Promise.reject(err));
  }
}
