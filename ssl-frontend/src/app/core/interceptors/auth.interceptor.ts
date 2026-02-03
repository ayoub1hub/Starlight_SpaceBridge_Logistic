// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { catchError, throwError, from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // Skip token injection for public endpoints
  const publicEndpoints = [
    '/api/auth/entrepot/validate-credentials',
    '/api/public',
    '/assets',
    '/actuator',
    '/protocol/openid-connect/token' // Exclude Keycloak token endpoint
  ];

  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isPublicEndpoint) {
    console.log('🌐 Public endpoint, skipping auth:', req.url);
    return next(req);
  }

  // Get token - try direct token first, then Keycloak
  const directToken = localStorage.getItem('access_token');
  
  if (directToken) {
    console.log('🔐 Using direct token from localStorage');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${directToken}`
      }
    });

    console.log('🔐 Adding auth token to request:', req.url);
    console.log('🎫 Token preview:', directToken.substring(0, 50) + '...');

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('❌ 401 Unauthorized - Direct token may be invalid or expired');
          console.error('📍 Failed URL:', req.url);
        } else if (error.status === 403) {
          console.error('❌ 403 Forbidden - User lacks required permissions');
          console.error('📍 Failed URL:', req.url);
        }
        return throwError(() => error);
      })
    );
  }

  // Fallback to Keycloak if no direct token
  if (!keycloakService.isLoggedIn()) {
    console.warn('⚠️ User not logged in and no direct token, request may fail:', req.url);
    return next(req);
  }

  // Get token asynchronously and add to request
  return from(keycloakService.getToken()).pipe(
    switchMap(token => {
      if (!token) {
        console.warn('⚠️ No token available for request:', req.url);
        return next(req);
      }

      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('🔐 Adding auth token to request:', req.url);
      console.log('🎫 Token preview:', token.substring(0, 50) + '...');

      return next(clonedRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            console.error('❌ 401 Unauthorized - Token may be invalid or expired');
            console.error('📍 Failed URL:', req.url);
            console.error('🔑 Token exists:', !!token);

            // Log token details for debugging
            try {
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.error('👤 Token subject:', payload.sub);
                console.error('🎭 Token roles:', payload.realm_access?.roles);
                console.error('⏰ Token exp:', new Date(payload.exp * 1000).toISOString());
                console.error('⏰ Current time:', new Date().toISOString());
                console.error('⚠️ Token expired:', Date.now() > payload.exp * 1000);
              }
            } catch (e) {
              console.error('❌ Could not decode token');
            }
          } else if (error.status === 403) {
            console.error('❌ 403 Forbidden - User lacks required permissions');
            console.error('📍 Failed URL:', req.url);
          }
          return throwError(() => error);
        })
      );
    })
  );
};
