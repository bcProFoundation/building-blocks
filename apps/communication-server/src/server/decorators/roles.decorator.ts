import { ReflectMetadata } from '@nestjs/common';

export const ROLES = 'roles';

export const Roles = (...roles: string[]) => ReflectMetadata(ROLES, roles);
