import { join } from 'path';

export const FOLDER_DIST: string = join(process.cwd(), 'dist');
export const FOLDER_DIST_BROWSER: string = join(
  FOLDER_DIST,
  'authorization-server',
);
export const INDEX_HTML = join(FOLDER_DIST_BROWSER, 'index.html');
