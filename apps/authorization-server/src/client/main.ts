import {
  enableProdMode,
  TRANSLATIONS,
  TRANSLATIONS_FORMAT,
} from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '../environments/environment';
import { AVAILABLE_TRANSLATIONS } from './constants/app-strings';

if (environment.production) {
  enableProdMode();
}

// use the require method provided by webpack
declare const require;
let lang = navigator.language;
if (!AVAILABLE_TRANSLATIONS.includes(lang)) {
  lang = 'en-US';
}
// we use the webpack raw-loader to return the content as a string
// tslint:disable-next-line
const translations = require(`raw-loader!./i18n/messages.${lang}.xlf`);

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    { provide: TRANSLATIONS, useValue: translations },
    { provide: TRANSLATIONS_FORMAT, useValue: 'xlf' },
  ],
});
