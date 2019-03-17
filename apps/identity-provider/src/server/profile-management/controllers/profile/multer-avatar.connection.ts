import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { BadRequestException } from '@nestjs/common';

export const multerAvatarConnection: MulterOptions = {
  fileFilter: (req, file, cb) => {
    if (['image/png', 'image/jpeg', 'image/gif'].includes(file.mimetype)) {
      const name = `${req.token.sub}.${file.mimetype.split('/')[1]}`;
      file.originalname = name;
      file.path = null;
      cb(null, true);
    } else {
      cb(new BadRequestException(), false);
    }
  },
};
