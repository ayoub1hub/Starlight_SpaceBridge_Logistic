// src/app/features/auth/user-login.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, UserRole } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
        <div class="p-8 bg-black/60 backdrop-blur-xl border border-white/10 relative">

          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>

          <div class="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
            <div>
              <p class="font-mono text-[10px] text-cyan-500 tracking-[0.3em] uppercase mb-1">
                User.Auth.v1.0
              </p>
              <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
                Secure <span class="text-cyan-500">Access</span>
              </h1>
            </div>
            <div class="text-right font-mono text-[9px] text-white/40 uppercase leading-tight">
              Step 3/3<br>Keycloak Authentication
            </div>
          </div>

          <div class="mb-8 space-y-3">
            <div class="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
              <svg class="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="font-mono text-xs">
                <span class="text-white/50">Entrepot:</span>
                <span class="text-cyan-400 ml-2">{{ entrepotCode() }}</span>
              </div>
            </div>
            
            <div class="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <div class="font-mono text-xs">
                <span class="text-white/50">Selected Role:</span>
                <span class="text-green-400 ml-2 uppercase">{{ selectedRole() }}</span>
              </div>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="relative group">
              <label class="block font-mono text-[10px] text-cyan-400 uppercase mb-2 tracking-widest">
                Username / Email
              </label>
              <input
                formControlName="username"
                type="text"
                class="w-full bg-white/5 border-b border-white/20 px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                placeholder="john.doe@ssl.com">
            </div>

            <div class="relative group">
              <label class="block font-mono text-[10px] text-cyan-400 uppercase mb-2 tracking-widest">
                Password
              </label>
              <div class="relative">
                <input
                  formControlName="password"
                  [type]="showPassword() ? 'text' : 'password'"
                  class="w-full bg-white/5 border-b border-white/20 px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                  placeholder="••••••••">
                <button
                  type="button"
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300 text-sm font-mono">
                  {{ showPassword() ? 'HIDE' : 'SHOW' }}
                </button>
              </div>
            </div>

            <div *ngIf="errorMessage()" class="p-3 bg-red-950/30 border border-red-500/50 text-red-400 font-mono text-[10px] uppercase">
              >> {{ errorMessage() }}
            </div>

            <button
              type="submit"
              [disabled]="isLoading() || loginForm.invalid"
              class="relative w-full py-4 bg-transparent border border-cyan-500/50 group overflow-hidden transition-all hover:border-cyan-400 disabled:opacity-50">
              <div class="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span class="relative z-10 font-mono font-black text-sm tracking-[0.3em] uppercase text-cyan-400 group-hover:text-black">
                {{ isLoading() ? 'Authenticating...' : 'Login' }}
              </span>
            </button>
          </form>

          <div class="mt-6 text-center font-mono text-[9px] text-white/40">
            <a href="#" class="text-cyan-400 hover:text-cyan-300">Forgot password?</a>
          </div>

          <div class="mt-10 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-tighter leading-none">
            <div class="flex gap-4">
              <span>Protocol: SSL</span>
              <span>Flow: Direct</span>
            </div>
            <div [class]="'animate-pulse ' + (loginForm.valid ? 'text-cyan-500' : 'text-white/20')">
              {{ loginForm.valid ? 'Ready' : 'Awaiting Input' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Reuse your global styles or keep them here if needed */
  `]
})
export class UserLoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  showPassword = signal(false);
  entrepotCode = signal<string>('');
  selectedRole = signal<UserRole | null>(null);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  ngOnInit() {
    console.log('🔐 User Login Component Initialized');

    // Get entrepot code from session storage
    const code = sessionStorage.getItem('entrepot_code');
    if (!code) {
      console.error('❌ No entrepot code found, redirecting to login');
      this.router.navigate(['/auth/login']);
      return;
    }
    this.entrepotCode.set(code);

    // Get selected role from session storage or localStorage
    const sessionRole = sessionStorage.getItem('selected_role') as UserRole;
    const localRole = localStorage.getItem('user_role') as UserRole;
    const role = sessionRole || localRole;

    if (!role || (role !== 'admin' && role !== 'responsable')) {
      console.error('❌ No valid role found, redirecting to role selection');
      this.router.navigate(['/auth/role-selection']);
      return;
    }

    this.selectedRole.set(role);
    console.log('✅ Context loaded - Entrepot:', code, 'Role:', role);
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { username, password } = this.loginForm.value;

    const tokenUrl = `${environment.keycloak.url}/realms/${environment.keycloak.realm}/protocol/openid-connect/token`;

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', environment.keycloak.clientId);
    body.set('client_secret', environment.keycloak.clientSecret || '');
    body.set('username', username!.trim());
    body.set('password', password!);
    body.set('scope', 'openid profile email');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post<any>(tokenUrl, body.toString(), { headers }).subscribe({
      next: (response) => {
        console.log('🔑 Token response received:', response);
        
        // Store tokens
        localStorage.setItem('access_token', response.access_token);
        if (response.refresh_token) localStorage.setItem('refresh_token', response.refresh_token);
        if (response.id_token) localStorage.setItem('id_token', response.id_token);

        // Decode and log the token for debugging
        let tokenRoles: string[] = [];
        try {
          const tokenParts = response.access_token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('📋 Token payload:', payload);
            console.log('👤 Token subject:', payload.sub);
            console.log('🎭 Token roles:', payload.realm_access?.roles);
            console.log('📝 Token scope:', response.scope);
            
            // Get roles from token payload (correct place)
            tokenRoles = payload.realm_access?.roles || [];
          }
        } catch (e) {
          console.error('❌ Failed to decode token:', e);
        }

        // Try to determine role from token payload (not scope)
        console.log('🔍 Roles from token payload:', tokenRoles);
        
        let role: UserRole | null = null;

        if (tokenRoles.includes('admin')) {
          role = 'admin';
        } else if (tokenRoles.includes('responsable')) {
          role = 'responsable';
        }

        console.log('✅ Determined role:', role);

        if (role) {
          this.authService.setSelectedRole(role);

          // Optional: keep entrepot code from previous step
          const entrepotCode = sessionStorage.getItem('entrepot_code');
          if (entrepotCode) {
            sessionStorage.setItem('entrepot_code', entrepotCode);
          }

          const destination = role === 'admin'
            ? '/admin/dashboard'
            : '/responsable/dashboard';

          console.log('🚀 Redirecting to:', destination);
          
          // Wait a moment for Keycloak to fully initialize
          setTimeout(() => {
            this.router.navigate([destination]);
          }, 500);
        } else {
          // No valid role found → show error or redirect to role selection
          console.error('❌ No valid role found in token');
          this.errorMessage.set('No valid role assigned. Contact administrator.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.error_description || 'Login failed. Invalid credentials.';
        this.errorMessage.set(msg);
        console.error('Direct login error:', err);
      }
    });
  }
}
