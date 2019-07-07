import { NewAvatarUploadedHandler } from './new-avatar-uploaded/new-avatar-uploaded.handler';
import { AvatarDeletedHandler } from './avatar-deleted/avatar-deleted.handler';

export const ProfileManagementEventHandlers = [
  NewAvatarUploadedHandler,
  AvatarDeletedHandler,
];
