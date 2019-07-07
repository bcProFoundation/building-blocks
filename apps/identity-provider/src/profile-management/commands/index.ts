import { UploadNewAvatarHandler } from './upload-new-avatar/upload-new-avatar.handler';
import { DeleteAvatarHandler } from './delete-avatar/delete-avatar.handler';

export const ProfileManagementCommandHandlers = [
  UploadNewAvatarHandler,
  DeleteAvatarHandler,
];
