// src/app/layouts/responsable-layout.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { KeycloakService } from 'keycloak-angular'; // ✅ Official Keycloak service

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-responsable-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-black overflow-hidden">
      <!-- Sidebar -->
      <aside [class.w-64]="!isCollapsed()"
             [class.w-20]="isCollapsed()"
             class="bg-gradient-to-b from-slate-950 via-emerald-950/30 to-black text-white transition-all duration-300 ease-in-out border-r border-emerald-500/20 shadow-[4px_0_20px_rgba(16,185,129,0.1)]">

        <!-- Logo & Toggle -->
        <div class="flex items-center justify-between p-4 border-b border-emerald-500/20">
          <div *ngIf="!isCollapsed()" class="flex items-center space-x-3">
            <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <span class="font-black text-xl tracking-tighter">SSL</span>
              <p class="font-mono text-[8px] text-emerald-500 uppercase tracking-wider">Ops_Terminal</p>
            </div>
          </div>
          <button (click)="toggleSidebar()"
                  class="p-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    [attr.d]="isCollapsed() ? 'M13 5l7 7-7 7M5 5l7 7-7 7' : 'M11 19l-7-7 7-7m8 14l-7-7 7-7'"/>
            </svg>
          </button>
        </div>

        <!-- User Profile -->
        <div class="p-4 border-b border-emerald-500/20">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              {{ getUserInitials() }}
            </div>
            <div *ngIf="!isCollapsed()" class="flex-1 min-w-0">
              <p class="font-bold text-sm truncate">{{ getUserFullName() }}</p>
              <p class="font-mono text-[9px] text-emerald-500 truncate uppercase tracking-wider">Responsable</p>
            </div>
          </div>
        </div>

        <!-- Microservices Section -->
        <div class="p-4 border-b border-emerald-500/20">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p *ngIf="!isCollapsed()" class="font-mono text-[9px] text-gray-500 uppercase tracking-wider">Services</p>
          </div>
          <nav class="space-y-1">
            <a *ngFor="let service of microservices"
               [routerLink]="service.route"
               routerLinkActive="bg-emerald-600/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
               class="flex items-center space-x-3 p-2.5 rounded border border-transparent hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group cursor-pointer">
              <span [innerHTML]="service.icon" class="w-4 h-4 flex-shrink-0 text-emerald-500"></span>
              <span *ngIf="!isCollapsed()" class="font-mono text-[10px] text-gray-300 uppercase tracking-wide">{{ service.label }}</span>
            </a>
          </nav>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-4 space-y-2 overflow-y-auto" style="height: calc(100vh - 380px)">
          <p *ngIf="!isCollapsed()" class="font-mono text-[9px] text-gray-600 uppercase tracking-wider mb-3 px-3">Operations</p>
          <a *ngFor="let item of menuItems"
             [routerLink]="item.route"
             routerLinkActive="bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
             class="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all group cursor-pointer">
            <span [innerHTML]="item.icon" class="w-5 h-5 flex-shrink-0"></span>
            <span *ngIf="!isCollapsed()" class="font-medium text-sm">{{ item.label }}</span>
            <span *ngIf="!isCollapsed() && item.badge"
                  class="ml-auto bg-red-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
              {{ item.badge }}
            </span>
          </a>
        </nav>

        <!-- Logout Button -->
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-emerald-500/20 bg-black">
          <button (click)="logout()"
                  class="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600/20 border border-transparent hover:border-red-500 transition-all group">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span *ngIf="!isCollapsed()" class="font-mono text-xs uppercase tracking-wider text-red-500">Disconnect</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden bg-black">
        <!-- Top Header -->
        <header class="bg-gradient-to-r from-slate-950 to-black border-b border-emerald-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-10">
          <div class="flex items-center justify-between p-4">
            <div class="flex items-center space-x-4">
              <h1 class="text-3xl font-black italic text-white tracking-tighter uppercase">
                {{ getPageTitle() }}
              </h1>
              <div class="h-6 w-px bg-emerald-500/30"></div>
              <p class="font-mono text-[9px] text-emerald-500 uppercase tracking-wider">Operational_Hub</p>
            </div>

            <!-- Header Actions -->
            <div class="flex items-center space-x-4">
              <button class="relative p-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all group">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span class="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              <button routerLink="/responsable/settings"
                      class="p-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all group">
                <svg class="w-6 h-6 text-gray-400 group-hover:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-black">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      scrollbar-width: thin;
      scrollbar-color: rgba(16, 185, 129, 0.3) transparent;
    }
    :host ::ng-deep ::-webkit-scrollbar {
      width: 6px;
    }
    :host ::ng-deep ::-webkit-scrollbar-track {
      background: transparent;
    }
    :host ::ng-deep ::-webkit-scrollbar-thumb {
      background: linear-gradient(to bottom, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3));
      border-radius: 3px;
    }
    :host ::ng-deep ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(to bottom, rgba(16, 185, 129, 0.5), rgba(6, 182, 212, 0.5));
    }
  `]
})
export class ResponsableLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService); // ✅ Official service

  isCollapsed = signal(false);

  microservices: MenuItem[] = [
    {
      label: 'Stock',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      route: '/responsable/stock'
    },
    {
      label: 'Vente',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      route: '/responsable/vente'
    },
    {
      label: 'Delivery',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      route: '/responsable/deliveries'
    },
    {
      label: 'Commande',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>',
      route: '/responsable/orders'
    },
    {
      label: 'Comptabilité',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      route: '/responsable/comptabilite'
    },
    {
      label: 'Payment',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      route: '/responsable/payments'
    }
  ];

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
      route: '/responsable/dashboard'
    },
    {
      label: 'Missions',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>',
      route: '/responsable/missions',
      badge: 3
    },
    {
      label: 'Reports',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      route: '/responsable/reports'
    },
    {
      label: 'Settings',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      route: '/responsable/settings'
    }
  ];

  toggleSidebar(): void {
    this.isCollapsed.update(value => !value);
  }

  logout(): void {
    this.authService.logout();
  }

  getUserInitials(): string {
    const fullName = this.getUserFullName();
    if (!fullName) return 'R';
    const names = fullName.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0][0].toUpperCase();
  }

  getUserFullName(): string | null {
    const token = this.keycloakService.getKeycloakInstance()?.tokenParsed;
    return token?.['name'] || token?.['preferred_username'] || null;
  }

  getPageTitle(): string {
    const url = this.router.url;
    const segment = url.split('/').pop() || 'dashboard';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  }
}
