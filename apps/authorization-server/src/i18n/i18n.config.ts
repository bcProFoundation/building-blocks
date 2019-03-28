import * as internationalization from 'i18n';
import { join } from 'path';

let directory = join(process.cwd(), '/src/i18n');
if (process.env.NODE_ENV === 'test') {
  directory = '/tmp';
} else if (process.env.NODE_ENV === 'development') {
  directory = join(process.cwd(), '/src/i18n');
} else if (process.env.NODE_ENV === 'production') {
  directory = join(process.cwd(), 'dist/out-tsc/i18n');
}

internationalization.configure({ directory });

export const i18n = internationalization;
