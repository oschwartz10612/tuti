// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDHBX0iPNiy7ZIFcZWc7OPyjmVqb9bN5-0",
    authDomain: "tuti-943d2.firebaseapp.com",
    databaseURL: "https://tuti-943d2.firebaseio.com",
    projectId: "tuti-943d2",
    storageBucket: "tuti-943d2.appspot.com",
    messagingSenderId: "48948420841",
    appId: "1:48948420841:web:f82f185ae7cdd448c75078"
  },
  spotify: {
    clientId: 'a13813d2b05d4421a3429977e9cc568c',
    redirectUri: 'http://localhost:4200/callback'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
