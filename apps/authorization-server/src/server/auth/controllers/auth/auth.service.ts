import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../../models/user/user.service';
import { CryptographerService } from '../../../utilities/cryptographer.service';
import { AuthData } from '../../../models/auth-data/auth-data.entity';
import { User } from '../../../models/user/user.entity';
import {
  INVALID_PASSWORD,
  INVALID_USER,
  USER_DISABLED,
} from '../../../constants/messages';
import { AuthDataService } from '../../../models/auth-data/auth-data.service';
import { Role } from '../../../models/role/role.entity';
import { CreateUserDto } from '../../../models/user/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly cryptoService: CryptographerService,
    private readonly authDataService: AuthDataService,
  ) {}

  /**
   * Creates User with hash password
   * @param user 
   * @param roles 
   */
  public async signUp(user: CreateUserDto, roles?: Role[]) {
    const userEntity = new User();
    userEntity.name = user.name;
    userEntity.email = user.email;

    const authData = new AuthData();
    authData.password = await this.cryptoService.hashPassword(user.password);
    userEntity.password = await this.authDataService.save(authData);

    if (roles && roles.length) {
      userEntity.roles = roles;
    }

    return await this.userService.save(userEntity);
  }

  public async logIn(email, password) {
    return await this.userService
      .findOne({ email })
      .then(async user => {
        if (!user) throw new UnauthorizedException(INVALID_USER);
        if (user.disabled !== 0) throw new UnauthorizedException(USER_DISABLED);
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
