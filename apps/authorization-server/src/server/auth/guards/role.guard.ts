import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from '../../constants/app-strings';
import { UserService } from '../../user-management/entities/user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>(ROLES, context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const localUser = await this.userService.findOne({
      uuid: request.user.user,
    });
    if (localUser) {
      const localUserRoles = await localUser.roles;
      const hasRole = () => localUserRoles.some(role => roles.includes(role));
      return localUser && localUserRoles && hasRole();
    }
  }
}
