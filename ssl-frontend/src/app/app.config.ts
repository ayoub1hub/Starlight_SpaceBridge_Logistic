// src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor'; // Changed: lowercase function import

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak
      .init({
        config: {
          url: environment.keycloak.url,
          realm: environment.keycloak.realm,
          clientId: environment.keycloak.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          responseMode: 'query',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          enableLogging: true,
        },
        bearerExcludedUrls: ['/assets', '/api/auth/entrepot/validate-credentials'],
        shouldAddToken: (request) => {
          const url = request.url;
          return url.includes('/api/') &&
            !url.includes('/api/public') &&
            !url.includes('/api/auth/entrepot/validate-credentials');
        },
      })
      .then(() => {
        console.log('✅ Keycloak ready');
        return true;
      })
      .catch((err) => {
        console.error('Keycloak init failed — app continues without auth', err);
        return true; // don't block bootstrap
      });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
  ],
};
