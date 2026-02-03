import { Injectable, inject, signal } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type UserRole = 'admin' | 'responsable';

export interface EntrepotValidationRequest {
  code: string;
  password: string;
}

export interface EntrepotValidationResponse {
  valid: boolean;
  message?: string;
  entrepotId?: string;
}


@Injectable({ providedIn: 'root' })
export class AuthService {
  keycloak = inject(KeycloakService);
  private http = inject(HttpClient);
  private roleSignal = signal<UserRole | null>(null);

  constructor() {
    console.log('🔧 AuthService initialized');
    this.loadRoleFromStorage();

    // Expose Keycloak instance to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).keycloak = this.keycloak;
      console.log('✅ Keycloak exposed to window.keycloak');
    }
  }

  private loadRoleFromStorage(): void {
    const storedRole = localStorage.getItem('user_role');
    if (storedRole === 'admin' || storedRole === 'responsable') { // Changed to lowercase
      this.roleSignal.set(storedRole);
      console.log('📦 Loaded role from localStorage:', storedRole);
    } else {
      console.log('ℹ️ No valid role found in localStorage');
    }
  }

  private getRolesFromToken(): UserRole[] {
    try {
      const token = this.keycloak.getKeycloakInstance().tokenParsed;
      if (!token || !token.realm_access?.roles) {
        console.log('ℹ️ No roles found in Keycloak token');
        return [];
      }

      const roles = token.realm_access.roles
        .filter((role: string): role is UserRole =>
          role === 'admin' || role === 'responsable' // Changed to lowercase to match Keycloak
        );

      console.log('Roles from Keycloak token:', roles);
      return roles;
    } catch (e) {
      console.error('Failed to parse roles from token:', e);
      return [];
    }
  }

  selectedRole(): UserRole | null {
    const current = this.roleSignal();
    if (current) {
      console.log('Current role from signal:', current);
      return current;
    }

    // Try to get from Keycloak if authenticated
    if (this.keycloak.isLoggedIn()) {
      const roles = this.getRolesFromToken();
      const role = roles[0] || null;
      if (role) {
        console.log('ℹNo role in signal, using first Keycloak role:', role);
        this.setSelectedRole(role);
      }
      return role;
    }

    console.log('ℹNo role available');
    return null;
  }

  setSelectedRole(role: UserRole): void{
    console.log('Setting role:', role);
    this.roleSignal.set(role);
    localStorage.setItem('user_role', role);
    console.log('Role saved to localStorage and signal:', role);
  }

  autoSetRoleFromToken(): UserRole | null {
    console.log('Auto-detecting role from Keycloak token...');
    const roles = this.getRolesFromToken();

    if (roles.length > 0) {
      const role = roles[0];
      console.log('Found role in token, auto-setting:', role);
      this.setSelectedRole(role);
      return role;
    }

    console.log('⚠No valid role found in token');
    return null;
  }

  /**
   * Check if user is authenticated via Keycloak
   */
  async isAuthenticated(): Promise<boolean> {
    // Check if we have a direct token from password grant
    const directToken = localStorage.getItem('access_token');
    if (directToken) {
      console.log('🔐 Found direct token, checking validity...');
      try {
        // Simple token validation - check if not expired
        const tokenParts = directToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const now = Math.floor(Date.now() / 1000);
          if (payload.exp > now) {
            console.log('✅ Direct token is valid');
            return true;
          }
        }
      } catch (e) {
        console.error('❌ Invalid direct token format');
      }
    }

    const isLoggedIn = this.keycloak.isLoggedIn();
    console.log('🔐 Authentication check - isLoggedIn:', isLoggedIn);
    return isLoggedIn;
  }

  /**
   * Initiate Keycloak login - Redirects to Keycloak login page
   */
  login(): void {
    console.log('🚀 AuthService.login() called');
    console.log('🔗 Current location:', window.location.href);

    const redirectUri = window.location.origin + '/auth/callback';
    console.log('🔗 Redirect URI:', redirectUri);

    try {
      console.log('🔐 Calling Keycloak login...');

      // This will redirect the browser to Keycloak
      this.keycloak.login({
        redirectUri: redirectUri,
        // Add these options for better compatibility
        prompt: 'login', // Force login screen
      });

      console.log('⚠️ This line should NOT be reached - login() should redirect');
    } catch (error) {
      console.error('❌ Keycloak login error:', error);
      throw error;
    }
  }

  /**
   * Logout from Keycloak and clear local data
   */
  logout(): void {
    console.log('👋 Logging out...');
    this.roleSignal.set(null);
    localStorage.clear(); // Clear everything including user_role
    sessionStorage.clear();

    const logoutUri = window.location.origin + '/home';
    console.log('🔗 Logout redirect URI:', logoutUri);

    // Force Keycloak logout
    this.keycloak.logout(logoutUri);
  }

  validateEntrepotCredentials(request: EntrepotValidationRequest): Observable<EntrepotValidationResponse> {
    console.log('📝 Validating entrepot credentials for code:', request.code);
    return this.http.post<EntrepotValidationResponse>('/api/auth/entrepot/validate-credentials', request);
  }

  getUserInfo() {
    try {
      const token = this.keycloak.getKeycloakInstance().tokenParsed;
      if (!token) {
        console.log('ℹ️ No token available');
        return null;
      }

      const userInfo = {
        username: token?.["preferred_username"] || 'Unknown',
        email: token?.["email"] || '',
        firstName: token?.["given_name"] || '',
        lastName: token?.["family_name"] || '',
        roles: this.getRolesFromToken()
      };

      console.log('👤 User info:', userInfo);
      return userInfo;
    } catch (e) {
      console.error('❌ Failed to get user info:', e);
      return null;
    }
  }

  /**
   * Get access token
   */
  async getToken(): Promise<string | undefined> {
    try {
      const token = await this.keycloak.getToken();
      console.log('🎫 Token retrieved:', token ? 'Available' : 'Not available');
      return token;
    } catch (e) {
      console.error('❌ Failed to get token:', e);
      return undefined;
    }
  }
}
