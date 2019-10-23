import { UploadNewAvatarHandler } from './upload-new-avatar/upload-new-avatar.handler';
import { DeleteAvatarHandler } from './delete-avatar/delete-avatar.handler';
import { DeleteProfileHandler } from './delete-profile/delete-profile.handler';

export const ProfileManagementCommandHandlers = [
  UploadNewAvatarHandler,
  DeleteAvatarHandler,
  DeleteProfileHandler,
];
