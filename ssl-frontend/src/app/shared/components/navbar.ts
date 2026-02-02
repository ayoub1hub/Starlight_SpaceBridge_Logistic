// src/app/shared/components/navbar.component.ts
import { Component, HostListener, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav
      [class.bg-black]="isScrolled() || isMobileMenuOpen()"
      [class.bg-transparent]="!isScrolled() && !isMobileMenuOpen()"
      class="fixed w-full z-50 transition-all duration-300 font-[Inter_Tight]"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-20">
          <a routerLink="/" class="flex items-center group">
            <img
              src="assets/images/pic.png"
              alt="SSL Logo"
              class="h-10 w-auto transition-transform duration-300 group-hover:scale-110"
            />
          </a>

          <!-- Desktop Links -->
          <div class="hidden md:flex items-center space-x-10">
            <a routerLink="/about" routerLinkActive="text-white" class="nav-link">About Us</a>
            <a routerLink="/services" routerLinkActive="text-white" class="nav-link">Services</a>
            <a routerLink="/contact" routerLinkActive="text-white" class="nav-link">Contact Us</a>
          </div>

          <!-- Desktop Actions -->
          <div class="hidden md:flex items-center space-x-6">
            @if (isAuthenticated()) {
              <a
                [routerLink]="getDashboardRoute()"
                class="spacex-btn">
                Dashboard
              </a>
              <button
                (click)="logout()"
                class="logout-btn">
                Logout
              </button>
            } @else {
              <button
                (click)="login()"
                class="spacex-btn">
                Login
              </button>
            }
          </div>

          <!-- Mobile Toggle -->
          <button (click)="toggleMobileMenu()" class="md:hidden p-2 text-white">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    [attr.d]="isMobileMenuOpen()
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (isMobileMenuOpen()) {
        <div class="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10 animate-slideDown">
          <div class="px-6 py-6 space-y-5">
            <a routerLink="/about" (click)="closeMobileMenu()" class="mobile-link">About Us</a>
            <a routerLink="/services" (click)="closeMobileMenu()" class="mobile-link">Services</a>
            <a routerLink="/contact" (click)="closeMobileMenu()" class="mobile-link">Contact Us</a>

            <div class="pt-6 border-t border-white/10 space-y-4">
              @if (isAuthenticated()) {
                <a
                  [routerLink]="getDashboardRoute()"
                  (click)="closeMobileMenu()"
                  class="spacex-btn w-full text-center">
                  Dashboard
                </a>
                <button
                  (click)="logout(); closeMobileMenu()"
                  class="logout-btn w-full text-center">
                  Logout
                </button>
              } @else {
                <button
                  (click)="login(); closeMobileMenu()"
                  class="spacex-btn w-full">
                  Login
                </button>
              }
            </div>
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }

    .nav-link {
      color: rgb(209 213 219);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      transition: color 0.3s ease;
    }

    .nav-link:hover {
      color: white;
    }

    .spacex-btn {
      position: relative;
      padding: 0.5rem 1.5rem;
      border: 1px solid white;
      color: white;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      background: transparent;
      transition: all 0.35s ease;
      overflow: hidden;
    }

    .spacex-btn:hover {
      background: white;
      color: black;
    }

    .logout-btn {
      color: rgba(255,255,255,0.6);
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      transition: color 0.3s ease;
    }

    .logout-btn:hover {
      color: white;
    }

    .mobile-link {
      display: block;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      color: rgba(255,255,255,0.75);
      transition: color 0.3s ease;
    }

    .mobile-link:hover {
      color: white;
    }
  `]
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isAuthenticated = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  async ngOnInit(): Promise<void> {
    this.isAuthenticated.set(await this.authService.isAuthenticated());
  }

  login(): void {
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.authService.logout();
  }

  getDashboardRoute(): string {
    const role = this.authService.selectedRole();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'responsable') return '/responsable/dashboard';
    return '/auth/login';
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
