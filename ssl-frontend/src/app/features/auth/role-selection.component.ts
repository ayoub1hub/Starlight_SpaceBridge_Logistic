// src/app/features/auth/role-selection.component.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, UserRole } from '../../core/services/auth.service';

@Component({
  selector: 'app-role-selection',
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
        <div class="p-8 bg-black/60 backdrop-blur-xl border border-white/10 relative">

          <div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50"></div>
          <div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50"></div>

          <div class="flex justify-between items-start mb-10 border-b border-white/10 pb-6">
            <div>
              <p class="font-mono text-[10px] text-cyan-500 tracking-[0.3em] uppercase mb-1">
                Role.Selection.v1.0
              </p>
              <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
                Mission <span class="text-cyan-500">Protocol</span>
              </h1>
            </div>
            <div class="text-right font-mono text-[9px] text-white/40 uppercase leading-tight">
              Step 2/3<br>Role Assignment
            </div>
          </div>

          <div class="mb-8">
            <div class="flex items-center gap-3 p-4 bg-white/5 border border-white/10">
              <svg class="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="font-mono text-xs">
                <span class="text-white/50">Entrepot:</span>
                <span class="text-cyan-400 ml-2">{{ entrepotCode() }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-4 mb-8">
            <p class="font-mono text-[10px] text-cyan-400 uppercase mb-4 tracking-widest">
              Select Your Access Level
            </p>

            <button
              type="button"
              [class]="'role-card ' + (selectedRole() === 'admin' ? 'selected-admin' : '')"
              (click)="selectRole('admin')">
              <div class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                  <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="1.5" d="M12 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-mono font-bold text-white uppercase text-sm mb-1">Administrator</h3>
                  <p class="font-mono text-[10px] text-white/50">Full system access & control</p>
                </div>
                <svg *ngIf="selectedRole() === 'admin'" class="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
              </div>
            </button>

            <button
              type="button"
              [class]="'role-card ' + (selectedRole() === 'responsable' ? 'selected-resp' : '')"
              (click)="selectRole('responsable')">
              <div class="flex items-center gap-4 p-6">
                <div class="w-12 h-12 bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                </div>
                <div class="flex-1 text-left">
                  <h3 class="font-mono font-bold text-white uppercase text-sm mb-1">Responsable</h3>
                  <p class="font-mono text-[10px] text-white/50">Warehouse management access</p>
                </div>
                <svg *ngIf="selectedRole() === 'responsable'" class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                </svg>
              </div>
            </button>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage()" class="mb-6 p-3 bg-red-950/30 border border-red-500/50 text-red-400 font-mono text-[10px] uppercase">
            >> Error: {{ errorMessage() }}
          </div>

          <button
            type="button"
            [disabled]="!selectedRole() || isProcessing()"
            (click)="proceedToKeycloak()"
            class="relative w-full py-4 bg-transparent border border-cyan-500/50 group overflow-hidden transition-all hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed">
            <div class="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span class="relative z-10 font-mono font-black text-sm tracking-[0.3em] uppercase text-cyan-400 group-hover:text-black">
              {{ isProcessing() ? 'Redirecting...' : 'Proceed to Authentication' }}
            </span>
          </button>

          <div class="mt-10 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-tighter leading-none">
            <div class="flex gap-4">
              <span>Next: Keycloak</span>
              <span>Role: {{ selectedRole() || 'UNSET' }}</span>
            </div>
            <div [class]="'animate-pulse ' + (selectedRole() ? 'text-cyan-500' : 'text-white/20')">
              {{ selectedRole() ? 'Ready' : 'Select Role' }}
            </div>
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
    .role-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .role-card:hover {
      border-color: rgba(255,255,255,0.3);
      background: rgba(255,255,255,0.08);
    }
    .selected-admin {
      border-color: rgba(34, 211, 238, 0.8) !important;
      background: rgba(34, 211, 238, 0.15) !important;
    }
    .selected-resp {
      border-color: rgba(16, 185, 129, 0.8) !important;
      background: rgba(16, 185, 129, 0.15) !important;
    }
  `]
})
export class RoleSelectionComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  selectedRole = signal<UserRole | null>(null);
  entrepotCode = signal<string>('');
  isProcessing = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    console.log('📋 Role Selection Component Initialized');

    const code = sessionStorage.getItem('entrepot_code');
    console.log('📦 Entrepot code from session:', code);

    if (!code) {
      console.error('❌ No entrepot code found, redirecting to login');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.entrepotCode.set(code);
    console.log('✅ Entrepot code set:', code);
  }

  selectRole(role: UserRole) {
    console.log('🎯 Role selected:', role);
    this.selectedRole.set(role);
    this.errorMessage.set(null);
  }

  async proceedToKeycloak() {
    const role = this.selectedRole();
    if (!role) {
      console.error('❌ No role selected');
      this.errorMessage.set('Please select a role before proceeding');
      return;
    }

    if (this.isProcessing()) {
      console.log('⏳ Already processing, ignoring click');
      return;
    }

    this.isProcessing.set(true);
    this.errorMessage.set(null);

    console.log('🚀 Proceeding to Keycloak authentication');
    console.log('📝 Selected role:', role);
    console.log('📝 Entrepot code:', this.entrepotCode());

    try {
      // ✅ Save role to BOTH sessionStorage AND localStorage for redundancy
      sessionStorage.setItem('selected_role', role);
      localStorage.setItem('user_role', role); // Also save to localStorage for SSO cases
      console.log('✅ Role saved to sessionStorage and localStorage:', role);

      // Double-check it was saved
      const savedSessionRole = sessionStorage.getItem('selected_role');
      const savedLocalRole = localStorage.getItem('user_role');
      console.log('✅ Verification - sessionStorage selected_role:', savedSessionRole);
      console.log('✅ Verification - localStorage user_role:', savedLocalRole);

      // Log all session data before redirect
      console.log('📦 Complete session data before Keycloak redirect:', {
        entrepot_code: sessionStorage.getItem('entrepot_code'),
        entrepot_id: sessionStorage.getItem('entrepot_id'),
        selected_role: sessionStorage.getItem('selected_role'),
        user_role: localStorage.getItem('user_role')
      });

      // Wait a moment to ensure storage is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      console.log('🔐 Initiating Keycloak login...');
      console.log('🔗 Redirect URI will be:', window.location.origin + '/auth/callback');

      // ✅ Call AuthService login method - this will redirect to Keycloak
      this.authService.login();

      // Note: Code after login() won't execute because login() redirects the page
      console.log('⚠️ If you see this, the redirect did not happen!');

    } catch (error) {
      console.error('❌ Error during Keycloak login initiation:', error);
      this.errorMessage.set('Failed to start authentication. Please try again.');
      this.isProcessing.set(false);
    }
  }
}
