// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  routes: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    CONFIRMATION: '/oauth2/confirmation',
    AUTHORIZE: '/oauth2/authorize',
    CHECK_USER: '/auth/verify_user',
    INFO: '/info',
    SIGNUP_VIA_EMAIL: '/signup/v1/email',
    VERIFY_SIGNUP_CODE: 'signup/v1/verify',
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
