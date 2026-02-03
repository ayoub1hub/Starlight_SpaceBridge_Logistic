// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { AuthService, UserRole } from '../services/auth.service';

export const publicGuard: CanActivateFn = (): boolean => {
  return true;
};

/**
 * Guard for role-selection page
 * Ensures user has completed step 1 (entrepot validation)
 */
export const roleSelectionGuard: CanActivateFn = (): boolean | UrlTree => {
  const router = inject(Router);
  const entrepotCode = sessionStorage.getItem('entrepot_code');

  if (!entrepotCode) {
    console.log('⚠️ roleSelectionGuard: No entrepot code found, redirecting to login');
    return router.parseUrl('/auth/login');
  }

  console.log('✅ roleSelectionGuard: Entrepot code found, allowing access');
  return true;
};

/**
 * Main authentication guard
 * Checks if user is authenticated via Keycloak AND has selected a role
 */
export const authGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 authGuard: Checking authentication...');

  // Check if user is authenticated via Keycloak
  const isAuthenticated = await authService.isAuthenticated();

  if (!isAuthenticated) {
    console.log('❌ authGuard: Not authenticated, clearing session and redirecting to login');
    sessionStorage.removeItem('entrepot_code');
    sessionStorage.removeItem('entrepot_id');
    sessionStorage.removeItem('selected_role');
    localStorage.removeItem('user_role');
    return router.parseUrl('/auth/login');
  }

  console.log('✅ authGuard: User is authenticated via Keycloak');

  // User is authenticated, check if they have a role selected
  let role = authService.selectedRole();
  console.log('🔍 authGuard: Initial role check:', role);

  if (role === null) {
    console.log('⚠️ authGuard: Authenticated but no role in localStorage');

    // FIRST: Try to get role from Keycloak token as fallback
    const userInfo = authService.getUserInfo();
    if (userInfo && userInfo.roles && userInfo.roles.length > 0) {
      const keycloakRole = userInfo.roles.find((r: string) => r === 'admin' || r === 'responsable') as UserRole || userInfo.roles[0];
      // ADDED: prefer valid business role if multiple roles exist
      console.log('ℹ️ authGuard: Found role in Keycloak token, auto-setting:', keycloakRole);
      authService.setSelectedRole(keycloakRole);
      role = keycloakRole;
    }
  }

  // SECOND: Check session storage as last resort
  if (role === null) {
    const sessionRole = sessionStorage.getItem('selected_role') as UserRole;
    if (sessionRole === 'admin' || sessionRole === 'responsable') {
      console.log('ℹ️ authGuard: Found role in sessionStorage, setting:', sessionRole);
      authService.setSelectedRole(sessionRole);
      role = sessionRole;
    }
  }

  // THIRD: Check localStorage (for SSO cases)
  if (role === null) {
    const localRole = localStorage.getItem('user_role') as UserRole;
    if (localRole === 'admin' || localRole === 'responsable') {
      console.log('ℹ️ authGuard: Found role in localStorage, setting:', localRole);
      authService.setSelectedRole(localRole);
      role = localRole;
    }
  }

  // ADDED: Final safety check – if still no role after all sources, force role selection if flow exists
  if (role === null) {
    console.log('⚠️ authGuard: Still no role available after all attempts');

    // Check if they're in the middle of the flow
    const entrepotCode = sessionStorage.getItem('entrepot_code');

    if (entrepotCode) {
      console.log('ℹ️ authGuard: Found entrepot code in session, redirecting to role selection');
      return router.parseUrl('/auth/role-selection');
    }

    // No flow in progress → clear everything and go back to start
    console.log('ℹ️ authGuard: No flow in progress, clearing session and redirecting to login');
    sessionStorage.clear(); // ADDED: more aggressive cleanup
    localStorage.removeItem('user_role');
    return router.parseUrl('/auth/login');
  }

  console.log('✅ authGuard: Access granted with role:', role);
  return true;
};

/**
 * Admin-specific guard
 * Ensures user has ADMIN role
 */
export const adminGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 adminGuard: Checking admin access...');

  const role = authService.selectedRole();

  if (role === 'admin') {
    console.log('✅ adminGuard: Admin access granted');
    return true;
  }

  // ADDED: Quick early exit if not even authenticated
  const isAuthenticated = await authService.isAuthenticated();
  if (!isAuthenticated) {
    console.log('❌ adminGuard: Not authenticated, clearing session and redirecting to login');
    sessionStorage.clear(); // ADDED: full cleanup
    localStorage.removeItem('user_role');
    return router.parseUrl('/auth/login');
  }

  // User is authenticated but wrong role
  if (role === 'responsable') {
    console.log('⚠️ adminGuard: User is RESPONSABLE, redirecting to responsable dashboard');
    return router.parseUrl('/responsable/dashboard');
  }

  // ADDED: If no role but flow in progress → go to role selection
  const entrepotCode = sessionStorage.getItem('entrepot_code');
  if (entrepotCode) {
    console.log('⚠️ adminGuard: No role but entrepot flow detected → redirecting to role selection');
    return router.parseUrl('/auth/role-selection');
  }

  // Fallback: no valid role or flow → restart
  console.log('⚠️ adminGuard: No valid role or flow, clearing session and redirecting to login');
  sessionStorage.clear(); // ADDED: consistent cleanup
  localStorage.removeItem('user_role');
  return router.parseUrl('/auth/login');
};

/**
 * Responsable-specific guard
 * Ensures user has RESPONSABLE role
 */
export const responsableGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔒 responsableGuard: Checking responsable access...');

  const role = authService.selectedRole();

  if (role === 'responsable') {
    console.log('✅ responsableGuard: Responsable access granted');
    return true;
  }

  // ADDED: Quick early exit if not even authenticated
  const isAuthenticated = await authService.isAuthenticated();
  if (!isAuthenticated) {
    console.log('❌ responsableGuard: Not authenticated, clearing session and redirecting to login');
    sessionStorage.clear(); // ADDED
    localStorage.removeItem('user_role');
    return router.parseUrl('/auth/login');
  }

  // User is authenticated but wrong role
  if (role === 'admin') {
    console.log('⚠️ responsableGuard: User is ADMIN, redirecting to admin dashboard');
    return router.parseUrl('/admin/dashboard');
  }

  // ADDED: If no role but flow in progress → go to role selection
  const entrepotCode = sessionStorage.getItem('entrepot_code');
  if (entrepotCode) {
    console.log('⚠️ responsableGuard: No role but entrepot flow detected → redirecting to role selection');
    return router.parseUrl('/auth/role-selection');
  }

  // Fallback: restart login
  console.log('⚠️ responsableGuard: No valid role or flow, clearing session and redirecting to login');
  sessionStorage.clear(); // ADDED
  localStorage.removeItem('user_role');
  return router.parseUrl('/auth/login');
};
