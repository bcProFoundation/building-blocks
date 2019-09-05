import { Injectable } from '@nestjs/common';
import { RoleService } from '../../entities/role/role.service';

@Injectable()
export class RoleValidationPolicyService {
  constructor(private readonly role: RoleService) {}

  async validateRoles(roles: string[]) {
    const validRoles = await this.role.find({ name: { $in: roles } });
    if (validRoles.length === roles.length) {
      return true;
    }
    return false;
  }

  async getValidRoles(roles: string[]) {
    const validRoles = await this.role.find({ name: { $in: roles } });
    return validRoles.map(role => role.name);
  }
}
