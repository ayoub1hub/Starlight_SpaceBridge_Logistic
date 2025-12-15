// src/app/layouts/public-layout/public-layout.component.ts
import { Component, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-white">
      <!-- Modern Navigation Header -->
      <nav [class.shadow-lg]="isScrolled()"
           [class.bg-white]="isScrolled()"
           [class.bg-transparent]="!isScrolled()"
           class="fixed w-full z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-20">
            <!-- Logo -->
            <a routerLink="/" class="flex items-center space-x-3 group">
              <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2.5 group-hover:scale-110 transition-transform">
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span [class.text-gray-900]="isScrolled()"
                    [class.text-white]="!isScrolled()"
                    class="text-2xl font-bold transition-colors">
                SSL Logistics
              </span>
            </a>

            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-8">
              <a *ngFor="let item of navItems"
                 [routerLink]="item.route"
                 routerLinkActive="text-indigo-600 font-semibold"
                 [routerLinkActiveOptions]="{exact: item.route === '/'}"
                 [class.text-gray-700]="isScrolled()"
                 [class.text-white]="!isScrolled()"
                 class="hover:text-indigo-600 transition-colors font-medium">
                {{ item.label }}
              </a>

              <a routerLink="/login"
                 class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Admin Login
              </a>
            </div>

            <!-- Mobile Menu Button -->
            <button (click)="toggleMobileMenu()"
                    class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg class="w-6 h-6" [class.text-gray-900]="isScrolled()" [class.text-white]="!isScrolled()"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      [attr.d]="isMobileMenuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div *ngIf="isMobileMenuOpen()"
             class="md:hidden bg-white border-t shadow-lg animate-slideDown">
          <div class="px-4 py-6 space-y-4">
            <a *ngFor="let item of navItems"
               [routerLink]="item.route"
               (click)="closeMobileMenu()"
               class="block py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              {{ item.label }}
            </a>
            <a routerLink="/login"
               (click)="closeMobileMenu()"
               class="block w-full text-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold">
              Admin Login
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main>
        <router-outlet></router-outlet>
      </main>

      <!-- Modern Footer -->
      <footer class="bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Company Info -->
            <div class="col-span-1 md:col-span-2">
              <div class="flex items-center space-x-3 mb-4">
                <div class="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <span class="text-xl font-bold">SSL Logistics</span>
              </div>
              <p class="text-gray-400 mb-4 max-w-md">
                Starlight Spacebridge Logistics - Your trusted partner in supply chain management and logistics solutions.
              </p>
              <div class="flex space-x-4">
                <a href="#" class="w-10 h-10 bg-slate-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" class="w-10 h-10 bg-slate-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" class="w-10 h-10 bg-slate-700 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            <!-- Quick Links -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li><a routerLink="/about" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a routerLink="/services" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a routerLink="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a routerLink="/login" class="text-gray-400 hover:text-white transition-colors">Admin Portal</a></li>
              </ul>
            </div>

            <!-- Contact Info -->
            <div>
              <h3 class="font-semibold text-lg mb-4">Contact</h3>
              <ul class="space-y-2 text-gray-400">
                <li class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span>contact@ssl-logistics.com</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>Mohammedia, Morocco</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Bottom Bar -->
          <div class="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-400 text-sm">© 2024 SSL Logistics. All rights reserved.</p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }
  `]
})
export class PublicLayoutComponent {
  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  navItems = [
    { label: 'Home', route: '/' },
    { label: 'About', route: '/about' },
    { label: 'Services', route: '/services' },
    { label: 'Contact', route: '/contact' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
