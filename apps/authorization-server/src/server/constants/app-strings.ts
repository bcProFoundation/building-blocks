import { join } from 'path';

export const FOLDER_DIST: string = join(process.cwd(), 'dist');
export const SERVER_MAIN_JS = join(process.cwd(), 'dist', 'server', 'main');
export const FOLDER_DIST_BROWSER: string = join(
  FOLDER_DIST,
  'authorization-server',
);
export const INDEX_HTML = join(FOLDER_DIST_BROWSER, 'index.html');
export const VIEWS_DIR = join(process.cwd(), '/src/server/views');
export const ACCOUNTS_ROUTE = '/account';
export const ADMINISTRATOR = 'administrator';
export const ADMIN_ROLE = 'admin';
export const ADMINISTRATOR_NAME = 'Administrator';
export const ADMIN_EMAIL = 'Administrator';
export const ROLES = 'roles';
export const AUTHORIZATION = 'authorization';
