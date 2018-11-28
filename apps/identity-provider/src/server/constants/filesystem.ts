import { join } from 'path';

export const FOLDER_DIST: string = join(process.cwd(), 'dist');
export const FOLDER_DIST_BROWSER: string = join(
  FOLDER_DIST,
  'identity-provider',
);
export const INDEX_HTML = join(FOLDER_DIST_BROWSER, 'index.html');

export const AVATAR_IMAGE_FOLDER: string = join(process.cwd(), '/files/public');
export const AVATAR_ROUTE_PREFIX = '/avatar/';
