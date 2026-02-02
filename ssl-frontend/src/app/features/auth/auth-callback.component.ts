// src/app/features/auth/auth-callback.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService, UserRole } from '../../core/services/auth.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-0 bg-black overflow-hidden">
      <video autoplay muted loop playsinline class="absolute w-full h-full object-cover opacity-40">
        <source src="assets/videos/vid2.mp4" type="video/mp4" />
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      <div class="absolute inset-0 pointer-events-none scanline opacity-20"></div>
    </div>

    <div class="relative min-h-screen flex items-center justify-center z-10 p-6">
      <div class="w-full max-w-lg hud-card animate-fade-in">
        <div class="p-12 bg-black/60 backdrop-blur-xl border border-white/10 relative">

          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>

          <div class="text-center">
            <div class="w-16 h-16 mx-auto mb-6 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>

            <p class="font-mono text-[10px] text-cyan-500 tracking-[0.3em] uppercase mb-2">
              Authentication.Protocol.v1.0
            </p>
            <h1 class="text-2xl font-black text-white tracking-tighter uppercase italic mb-6">
              Processing <span class="text-cyan-500">Access</span>
            </h1>

            <div class="space-y-2 font-mono text-[10px] text-white/50 uppercase">
              <p>{{ statusMessage }}</p>
              <p class="text-cyan-400">{{ progressMessage }}</p>
            </div>
          </div>

          <div class="mt-10 flex justify-center font-mono text-[8px] text-white/20 uppercase tracking-tighter">
            <span class="animate-pulse text-cyan-500">Authenticating...</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    @keyframes scan {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(1000%); }
    }
    .scanline {
      background: linear-gradient(to bottom, transparent, rgba(34, 211, 238, 0.1), transparent);
      height: 100px;
      width: 100%;
      animation: scan 8s linear infinite;
    }
    .hud-card {
      clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class AuthCallbackComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private keycloak = inject(KeycloakService);
  private http = inject(HttpClient);

  statusMessage = 'Validating credentials...';
  progressMessage = 'Step 3/3: Keycloak Authentication';

  async ngOnInit() {
    try {
      console.log('🔄 Auth callback initiated');

      const code = this.route.snapshot.queryParamMap.get('code');
      const state = this.route.snapshot.queryParamMap.get('state');
      const sessionState = this.route.snapshot.queryParamMap.get('session_state');

      console.log('📋 Callback params:', { code: !!code, state, sessionState });

      // Handle SSO case: already logged in but landed here without code
      if (!code && this.keycloak.isLoggedIn()) {
        console.log('ℹ️ Already authenticated via SSO, checking for saved role...');

        // ✅ FIXED: Check sessionStorage first (where role was saved), then localStorage, then Keycloak
        let validRole: UserRole | null = null;

        // 1. Check sessionStorage (primary source from role selection)
        const sessionRole = sessionStorage.getItem('selected_role');
        if (sessionRole === 'admin' || sessionRole === 'responsable') {
          validRole = sessionRole;
          console.log('✅ Role found in sessionStorage:', validRole);
        }

        // 2. Check localStorage as fallback
        if (!validRole) {
          const localRole = localStorage.getItem('user_role');
          if (localRole === 'admin' || localRole === 'responsable') {
            validRole = localRole;
            console.log('✅ Role found in localStorage:', validRole);
          }
        }

        // 3. Check Keycloak token as last resort
        if (!validRole) {
          const userInfo = this.authService.getUserInfo();
          if (userInfo?.roles?.length) {
            validRole = userInfo.roles[0]; // Already filtered to UserRole[]
            console.log('✅ Role found in Keycloak token:', validRole);
          }
        }

        if (validRole) {
          console.log('✅ Valid role found:', validRole);
          this.authService.setSelectedRole(validRole);
          const destination = validRole === 'admin' ? '/admin/dashboard' : '/responsable/dashboard';
          console.log('🎯 Redirecting to dashboard:', destination);
          this.router.navigate([destination]);
          return;
        }

        console.log('⚠️ No valid role available, redirecting to entrepot login');
        this.router.navigate(['/auth/login']);
        return;
      }

      if (!code) {
        console.error('❌ No authorization code received');
        this.statusMessage = 'Invalid authentication response';
        this.progressMessage = 'No authorization code found';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        return;
      }

      console.log('✅ Authorization code received');
      this.statusMessage = 'Processing authentication token...';

      // Get session data
      const rawSelectedRole = sessionStorage.getItem('selected_role');
      const entrepotCode = sessionStorage.getItem('entrepot_code');

      let selectedRole: UserRole | null = null;
      if (rawSelectedRole === 'admin' || rawSelectedRole === 'responsable') {
        selectedRole = rawSelectedRole;
      }

      console.log('📦 Session data:', { selectedRole, entrepotCode });

      if (!selectedRole || !entrepotCode) {
        console.error('❌ Missing session data - authentication flow incomplete');
        this.statusMessage = 'Session expired';
        this.progressMessage = 'Please start login process again';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
        return;
      }

      // Wait for Keycloak to finish authentication
      this.statusMessage = 'Exchanging authorization code...';
      this.progressMessage = 'Waiting for token exchange...';
      console.log('⏳ Waiting for Keycloak token processing...');
      await this.waitForKeycloakAuthentication();
      console.log('✅ Keycloak authentication confirmed');

      // Verify user has the selected role in Keycloak
      const userInfo = this.authService.getUserInfo();
      console.log('👤 User info from Keycloak:', userInfo);

      let finalRole: UserRole = selectedRole;
      if (userInfo?.roles?.length) {
        if (!userInfo.roles.includes(selectedRole)) {
          console.warn(`⚠️ User lacks ${selectedRole} role. Using first available:`, userInfo.roles[0]);
          finalRole = userInfo.roles[0];
        }
      }

      // Save role (type-safe)
      this.authService.setSelectedRole(finalRole);
      console.log('✅ Role saved to AuthService and localStorage');

      // Optional: validate with backend
      this.progressMessage = 'Validating warehouse access...';
      try {
        await this.http.post<{ valid: boolean, message?: string }>(
          '/api/auth/entrepot/validate',
          { code: entrepotCode, role: finalRole }
        ).toPromise();
        console.log('✅ Backend warehouse validation completed');
      } catch (backendError) {
        console.error('❌ Backend validation error (non-blocking):', backendError);
      }

      // Clean up
      sessionStorage.removeItem('entrepot_id');
      sessionStorage.removeItem('entrepot_code');
      sessionStorage.removeItem('selected_role');
      console.log('🧹 Session storage cleaned');

      // Redirect
      this.progressMessage = 'Initializing dashboard...';
      const destination = finalRole === 'admin'
        ? '/admin/dashboard'
        : '/responsable/dashboard';

      console.log('🎯 Redirecting to:', destination);
      await new Promise(resolve => setTimeout(resolve, 500));
      this.router.navigate([destination]).catch(navError => {
        console.error('❌ Router navigation failed, fallback reload:', navError);
        window.location.href = destination;
      });

    } catch (error) {
      console.error('❌ Callback error:', error);
      this.statusMessage = 'Authentication failed';
      this.progressMessage = error instanceof Error ? error.message : 'Unknown error';

      // Recovery attempt if authenticated
      const rawRecoveryRole = sessionStorage.getItem('selected_role');
      if (rawRecoveryRole === 'admin' || rawRecoveryRole === 'responsable' && this.keycloak.isLoggedIn()) {
        console.log('⚠️ Attempting recovery with role:', rawRecoveryRole);
        this.authService.setSelectedRole(rawRecoveryRole);
        const dest = rawRecoveryRole === 'admin' ? '/admin/dashboard' : '/responsable/dashboard';
        setTimeout(() => this.router.navigate([dest]), 1000);
        return;
      }

      sessionStorage.clear();
      setTimeout(() => this.router.navigate(['/auth/login']), 2000);
    }
  }

  private async waitForKeycloakAuthentication(): Promise<void> {
    const maxAttempts = 20;
    const initialDelay = 200;
    const maxDelay = 2000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔍 Authentication check attempt ${attempt}/${maxAttempts}`);
      try {
        await this.keycloak.updateToken(5);
        if (this.keycloak.isLoggedIn()) {
          const token = this.keycloak.getKeycloakInstance().tokenParsed;
          console.log('✅ Authenticated as:', token?.['preferred_username']);
          return;
        }
      } catch (error) {
        console.log(`⚠️ Token update attempt ${attempt} - still processing`);
      }
      const delay = Math.min(initialDelay * Math.pow(1.5, attempt - 1), maxDelay);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    throw new Error('Keycloak authentication timeout');
  }
}
