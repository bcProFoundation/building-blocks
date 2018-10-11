import { join } from 'path';

// export const APP_NAME = 'infrastructure-console';
// export const BROWSER_DIR = join(process.cwd(), 'dist', APP_NAME);
// export const INDEX_FILE = BROWSER_DIR + '/index.html';
export const APP_NAME = 'Infrastructure Console';
export const FOLDER_DIST: string = join(process.cwd(), 'dist');
export const FOLDER_DIST_BROWSER: string = join(
  FOLDER_DIST,
  'infrastructure-console',
);
export const INDEX_HTML = join(FOLDER_DIST_BROWSER, 'index.html');
