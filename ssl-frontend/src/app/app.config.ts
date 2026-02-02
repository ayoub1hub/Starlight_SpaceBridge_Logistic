// src/app/app.config.ts
import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { KeycloakService } from 'keycloak-angular';
import { environment } from '../environments/environment';
import { authInterceptor } from './core/interceptors/auth.interceptor'; // Changed: lowercase function import

function initializeKeycloak(keycloak: KeycloakService) {
  return () => {
    console.log('🔧 Keycloak initialization started...');

    // ✅ EMERGENCY FIX: If we're on callback without a code, redirect to home
    // This prevents Keycloak SSO from auto-redirecting us to callback
    const currentPath = window.location.pathname;
    const hasCode = window.location.search.includes('code=');

    if (currentPath === '/auth/callback' && !hasCode) {
      console.log('⚠️ Detected callback page without code - this is from Keycloak SSO');
      console.log('🔧 Forcing redirect to home to break the loop');
      window.location.href = '/home';
      return Promise.resolve();
    }

    return keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        // ✅ CRITICAL CHANGE: Don't use check-sso on load
        // This prevents automatic redirects to /auth/callback
        // We'll manually check authentication status instead
        onLoad: undefined, // Don't auto-check on load

        // Disable iframe check
        checkLoginIframe: false,

        // Don't use fragment for response mode
        responseMode: 'query',

        // OAuth 2.0 flow configuration
        flow: 'standard', // Authorization Code Flow
        pkceMethod: 'S256', // PKCE for security

        // Enable logging for debugging
        enableLogging: false,
      },

      // URLs that don't need Bearer token
      bearerExcludedUrls: [
        '/assets',
        '/actuator',
        '/api/auth/entrepot/validate-credentials', // ✅ Entrepot validation is public
      ],

      bearerPrefix: 'Bearer',

      // Function to determine if token should be added
      shouldAddToken: (request) => {
        const url = request.url;

        // Don't add token to public endpoints
        if (url.includes('/api/public') ||
          url.includes('/api/auth/entrepot/validate-credentials')) {
          return false;
        }

        // Add token to all other API requests
        return url.includes('/api/');
      }
    }).then(() => {
      console.log('✅ Keycloak initialized successfully');

      const isLoggedIn = keycloak.isLoggedIn();
      const currentPath = window.location.pathname;
      console.log('🔐 Authentication status:', isLoggedIn);
      console.log('📍 Current path:', currentPath);

      if (isLoggedIn) {
        const token = keycloak.getKeycloakInstance().tokenParsed;
        console.log('👤 Authenticated user:', token?.["preferred_username"]);
        console.log('📧 Email:', token?.["email"]);
        console.log('🎭 Realm roles:', token?.realm_access?.roles);

        // Set up token refresh
        keycloak.getKeycloakInstance().onTokenExpired = () => {
          console.log('⚠️ Token expired, refreshing...');
          keycloak.updateToken(30).then((refreshed) => {
            if (refreshed) {
              console.log('✅ Token refreshed successfully');
            } else {
              console.log('ℹ️ Token still valid');
            }
          }).catch(() => {
            console.error('❌ Failed to refresh token');
          });
        };

        // Check if user has a role saved
        let storedRole = localStorage.getItem('user_role');

        // If no stored role, try to auto-detect from Keycloak token
        if (!storedRole || (storedRole !== 'admin' && storedRole !== 'responsable')) {
          console.log('⚠️ No valid stored role, checking Keycloak token...');
          const roles = token?.realm_access?.roles || [];
          const validRole = roles.find((r: string) => r === 'admin' || r === 'responsable');

          if (validRole) {
            console.log('✅ Found role in Keycloak, auto-setting:', validRole);
            localStorage.setItem('user_role', validRole);
            storedRole = validRole;
          }
        }

        // If on callback page, let the callback component handle the logic
        if (currentPath === '/auth/callback') {
          console.log('ℹ️ On callback page - component will handle redirect');
          return Promise.resolve();
        }

        // If user has a role and is on root or auth pages, redirect to dashboard
        if (storedRole === 'admin' || storedRole === 'responsable') {
          console.log('✅ User already authenticated with role:', storedRole);

          if (currentPath === '/' || currentPath === '' || currentPath.startsWith('/auth/login') || currentPath.startsWith('/auth/role')) {
            const destination = storedRole === 'admin' ? '/admin/dashboard' : '/responsable/dashboard';
            console.log('🎯 Auto-redirecting to:', destination);

            // Small delay to ensure initialization completes
            setTimeout(() => {
              window.location.href = destination;
            }, 100);
          }
        } else {
          console.log('ℹ️ User authenticated but no role - needs to complete flow');

          // If on root and no role, send to entrepot login
          if (currentPath === '/' || currentPath === '') {
            console.log('🎯 Redirecting to entrepot login to start flow');
            setTimeout(() => {
              window.location.href = '/auth/login';
            }, 100);
          }
        }
      } else {
        console.log('ℹ️ No active session - user will authenticate during login flow');
      }

      return Promise.resolve();
    }).catch((error) => {
      console.error('❌ Keycloak initialization failed:', error);
      console.error('❌ Error details:', error.message);

      // Provide helpful error messages
      if (error.message && error.message.includes('401')) {
        console.error('');
        console.error('🔧 KEYCLOAK CONFIGURATION ERROR:');
        console.error('   The Keycloak client is rejecting the request (401 Unauthorized)');
        console.error('');
        console.error('   SOLUTION:');
        console.error('   1. Go to Keycloak Admin Console: http://localhost:8079/admin');
        console.error('   2. Select realm: ssl-realm');
        console.error('   3. Go to Clients → ssl-web');
        console.error('   4. In "Capability config" tab, set:');
        console.error('      - Client authentication: OFF ❌ (CRITICAL!)');
        console.error('      - Standard flow: ON ✅');
        console.error('   5. In "Access settings", add redirect URI:');
        console.error('      - http://localhost:4200/*');
        console.error('      - http://localhost:4200/auth/callback');
        console.error('   6. Add Web origins:');
        console.error('      - http://localhost:4200');
        console.error('   7. Click Save');
        console.error('   8. Refresh this page');
        console.error('');
      } else if (error.message && error.message.includes('Network')) {
        console.error('');
        console.error('🔧 KEYCLOAK SERVER ERROR:');
        console.error('   Cannot connect to Keycloak server');
        console.error('');
        console.error('   SOLUTION:');
        console.error('   1. Make sure Keycloak is running at: http://localhost:8079');
        console.error('   2. Verify realm "ssl-realm" exists');
        console.error('   3. Verify client "ssl-web" exists');
        console.error('');
      }

      // Don't block app startup even if Keycloak fails
      // The auth guards will handle redirects
      return Promise.resolve();
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Use functional interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])  // ← Changed to lowercase function
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakService,
  ],
};
