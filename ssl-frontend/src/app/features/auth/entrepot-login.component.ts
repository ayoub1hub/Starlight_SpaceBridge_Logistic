// src/app/features/auth/entrepot-login.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-entrepot-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
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
                Entrepot.Auth.v1.0
              </p>
              <h1 class="text-3xl font-black text-white tracking-tighter uppercase italic">
                Warehouse <span class="text-cyan-500">Access</span>
              </h1>
            </div>
            <div class="text-right font-mono text-[9px] text-white/40 uppercase leading-tight">
              Step 1/3<br>Code Validation
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div class="relative group">
              <label class="block font-mono text-[10px] text-cyan-400 uppercase mb-2 tracking-widest">
                Entrepot Code [ENT-ID]
              </label>
              <input
                formControlName="code"
                type="text"
                class="w-full bg-white/5 border-b border-white/20 px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all uppercase"
                placeholder="ENT-XXXX">
            </div>

            <div class="relative group">
              <label class="block font-mono text-[10px] text-cyan-400 uppercase mb-2 tracking-widest">
                Security Password
              </label>
              <input
                formControlName="password"
                type="password"
                class="w-full bg-white/5 border-b border-white/20 px-4 py-3 font-mono text-white focus:outline-none focus:border-cyan-500 focus:bg-white/10 transition-all"
                placeholder="••••••••">
            </div>

            <div *ngIf="errorMessage()" class="p-3 bg-red-950/30 border border-red-500/50 text-red-400 font-mono text-[10px] uppercase">
              >> Error: {{ errorMessage() }}
            </div>

            <button
              type="submit"
              [disabled]="isLoading() || loginForm.invalid"
              class="relative w-full py-4 bg-transparent border border-cyan-500/50 group overflow-hidden transition-all hover:border-cyan-400 disabled:opacity-50">
              <div class="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span class="relative z-10 font-mono font-black text-sm tracking-[0.3em] uppercase text-cyan-400 group-hover:text-black">
                {{ isLoading() ? 'Validating...' : 'Proceed to Role Selection' }}
              </span>
            </button>
          </form>

          <div class="mt-10 flex justify-between font-mono text-[8px] text-white/20 uppercase tracking-tighter leading-none">
            <div class="flex gap-4">
              <span>Protocol: SSL</span>
              <span>Auth: Multi-Step</span>
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
export class EntrepotLoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    code: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = {
      code: this.loginForm.value.code!.trim(),
      password: this.loginForm.value.password!
    };

    // Call backend to validate entrepot credentials
    this.http.post<{valid: boolean, message?: string, entrepotId?: string}>(
      '/api/auth/entrepot/validate-credentials',
      credentials
    ).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.valid) {
          // Store entrepot info and move to role selection
          console.log(response);
          sessionStorage.setItem('entrepot_id', response.entrepotId || '');
          sessionStorage.setItem('entrepot_code', credentials.code);
          this.router.navigate(['/auth/role-selection']);
        } else {
          this.errorMessage.set(response.message || 'Invalid credentials');
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'Validation failed');
      }
    });
  }
}
