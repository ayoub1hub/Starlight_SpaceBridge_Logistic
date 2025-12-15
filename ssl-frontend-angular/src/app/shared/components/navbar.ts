import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="bg-gray-900 border-b border-gray-700 shadow-lg sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <!-- Logo/App Name -->
            <a [routerLink]="['/']" class="flex-shrink-0 flex items-center">
              <span class="text-3xl text-cyan-400 font-extrabold mr-2">🛰️</span>
              <span class="text-white text-xl font-semibold tracking-wider hidden sm:block">SSL Logistics</span>
            </a>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4 text-sm font-medium">
              <a [routerLink]="['/']" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition duration-150">Home</a>
              <a [routerLink]="['/about']" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition duration-150">About</a>
              <a [routerLink]="['/services']" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition duration-150">Services</a>
              <a [routerLink]="['/contact']" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition duration-150">Contact</a>
            </div>
          </div>

          <!-- Auth/Admin Button -->
          <div class="flex items-center">
            @if (isAuthenticated()) {
              <!-- If logged in, show Dashboard link and Logout -->
              <a [routerLink]="['/admin/dashboard']" class="bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-cyan-500 transition duration-150 shadow-cyan-500/50 shadow-md">
                Admin Dashboard
              </a>
              <button (click)="logout()" class="ml-4 text-red-400 hover:text-white px-3 py-2 text-sm transition duration-150">
                Logout
              </button>
            } @else {
              <!-- If logged out, show Login link -->
              <a [routerLink]="['/login']" class="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-500 transition duration-150 shadow-indigo-500/50 shadow-md">
                Admin Login
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router); // ✅ Needed for logout redirect

  isAuthenticated(): boolean {
    // ✅ Call as method
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Optional: redirect after logout
  }
}

