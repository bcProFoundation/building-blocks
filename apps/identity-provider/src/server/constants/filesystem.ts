import { join } from 'path';

export const FOLDER_DIST: string = join(process.cwd(), 'dist');
export const SERVER_MAIN_JS = join(process.cwd(), 'dist', 'server', 'main');
export const FOLDER_DIST_BROWSER: string = join(
  FOLDER_DIST,
  'identity-provider',
);
export const INDEX_HTML = join(FOLDER_DIST_BROWSER, 'index.html');
