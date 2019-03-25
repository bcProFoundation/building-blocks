import { Injectable } from '@nestjs/common';
import { RoleService } from '../../entities/role/role.service';

@Injectable()
export class RoleValidationPolicyService {
  constructor(private readonly role: RoleService) {}

  async validateRoles(roles: string[]) {
    const RoleModel = this.role.getModel();
    const validRoles = await RoleModel.find({ name: { $in: roles } }).exec();
    if (validRoles.length === roles.length) {
      return true;
    }
    return false;
  }

  async getValidRoles(roles: string[]) {
    const RoleModel = this.role.getModel();
    const validRoles = await RoleModel.find({ name: { $in: roles } }).exec();
    return validRoles.map(role => role.name);
  }
}
