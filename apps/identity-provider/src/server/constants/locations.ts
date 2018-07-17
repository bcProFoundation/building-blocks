import { join } from 'path';

export const PUBLIC_DIR = join(__dirname, '..', '/public');
export const ANGULAR_DIR = join(
  __dirname,
  '..',
  '..',
  '..',
  '/dist/identity-provider',
);
export const VIEWS_DIR = join(__dirname, '..', '/views');
export const ACCOUNTS_ROUTE = '/account';
