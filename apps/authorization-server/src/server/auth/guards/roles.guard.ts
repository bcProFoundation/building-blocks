import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const localUser = await this.userService.findOne({
      email: request.user.email,
    });
    if (localUser) {
      const localUserRoles = await localUser.roles;
      const hasRole = () => localUserRoles.some(role => roles.indexOf(role));
      return localUser && localUserRoles && hasRole();
    }
  }
}
