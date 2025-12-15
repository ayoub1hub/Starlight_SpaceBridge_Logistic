// src/app/features/auth/login.component.ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 p-10 bg-gray-900 rounded-xl shadow-2xl border border-gray-800">
        <div>
          <h2 class="text-3xl font-bold text-white text-center">🔐 Agency Login</h2>
          <p class="text-gray-400 text-center mt-2">
            Sign in to manage your mission logistics with SSL.
          </p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="mt-8 space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition"
              placeholder="agency@example.com"
              autocomplete="email"
            />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
                 class="mt-1 text-sm text-red-400">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email address</span>
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="appearance-none relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:z-10 sm:text-sm transition"
              placeholder="••••••••"
              autocomplete="current-password"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                 class="mt-1 text-sm text-red-400">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
            </div>
          </div>

          <div *ngIf="successMessage()"
               class="p-4 bg-green-900/50 text-green-400 rounded-lg border border-green-700">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
              <span>{{ successMessage() }}</span>
            </div>
          </div>

          <div *ngIf="errorMessage()"
               class="p-4 bg-red-900/50 text-red-400 rounded-lg border border-red-700">
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="isLoading() || loginForm.invalid"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span *ngIf="!isLoading()" class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Sign In
              </span>
              <span *ngIf="isLoading()" class="flex items-center">
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging In...
              </span>
            </button>
          </div>
        </form>

        <div class="text-center text-sm mt-6">
          <span class="text-gray-400">Don't have an account yet?</span>
          <a [routerLink]="['/register']" class="ml-1 font-medium text-cyan-500 hover:text-cyan-400 transition">
            Register Now →
          </a>
        </div>

        <div class="mt-4 p-3 bg-gray-800/50 text-gray-400 text-xs rounded-lg border border-gray-700">
          <div class="flex items-start">
            <svg class="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <span>Your login session is encrypted and secure.</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// 4. Change class name to LoginComponent
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // 5. Create a simpler form group for Login
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    // MinLength is not strictly necessary for login, but Validators.required is key
    password: ['', [Validators.required]],
  });

  // 6. Remove passwordMatchValidator as it's not needed for login
  // Note: No custom validator needed here

  onSubmit() {
    // Mark all fields as touched to show validation errors
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // 7. Prepare login request (only email and password)
    const loginRequest = {
      email: this.loginForm.value.email || '',
      password: this.loginForm.value.password || '',
    };

    console.log('Submitting login:', { ...loginRequest, password: '***' });

    // 8. Call auth service's login method
    this.authService.login(loginRequest).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading.set(false);
        this.successMessage.set('✓ Login successful! Redirecting to dashboard...');

        // Redirect to admin dashboard after short delay
        setTimeout(() => {
          this.router.navigate(['/admin/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);

        console.error('Login Error:', err);

        // Display backend error message dynamically
        let errorMsg = 'Login failed. Please check your credentials.';

        if (err.error?.error) {
          errorMsg = err.error.error;
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.status === 0) {
          errorMsg = 'Cannot connect to server. Please check if the backend is running.';
        } else if (err.status === 401) {
          errorMsg = 'Invalid email or password. Please try again.';
        }

        this.errorMessage.set(errorMsg);
      }
    });
  }
}

// 9. Correctly export LoginComponent
export default LoginComponent;
