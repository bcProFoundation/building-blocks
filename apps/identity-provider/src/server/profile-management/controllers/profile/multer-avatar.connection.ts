import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/common/interfaces/external/multer-options.interface';
import { AVATAR_IMAGE_FOLDER } from '../../../constants/filesystem';

export const multerAvatarConnection: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, done) => {
      done(null, AVATAR_IMAGE_FOLDER);
    },
    filename: (req, file, cb) => {
      if (['image/png', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
        const name = `${req.token.sub}-${Date.now()}.${
          file.mimetype.split('/')[1]
        }`;
        cb(null, name);
      } else {
        cb(new BadRequestException());
      }
    },
  }),
};
