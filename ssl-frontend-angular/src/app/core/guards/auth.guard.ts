// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to login if not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated is a computed signal - call it with ()
  const authenticated = authService.isAuthenticated();

  if (authenticated) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Admin Guard - Protects routes that require admin role
 * Redirects based on authentication status
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Both are computed signals - call them with ()
  const authenticated = authService.isAuthenticated();
  const admin = authService.isAdmin();

  if (authenticated && admin) {
    return true;
  }

  // Redirect to dashboard if authenticated but not admin
  if (authenticated) {
    router.navigate(['/admin/dashboard']);
  } else {
    // Redirect to login if not authenticated
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
  return false;
};

/**
 * Public Guard - Prevents authenticated users from accessing login/register
 * Redirects authenticated users to dashboard
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // isAuthenticated is a computed signal - call it with ()
  const authenticated = authService.isAuthenticated();

  // If user is already authenticated, redirect to admin dashboard
  if (authenticated) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // Allow access to login/register for non-authenticated users
  return true;
};
