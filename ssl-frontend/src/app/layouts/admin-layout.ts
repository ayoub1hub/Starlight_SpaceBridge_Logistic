// src/app/layouts/admin-layout.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { KeycloakService } from 'keycloak-angular';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="flex h-screen bg-[#020202] text-white overflow-hidden font-sans">
      <!-- Sidebar -->
      <aside [class.w-72]="!isCollapsed()"
             [class.w-20]="isCollapsed()"
             class="relative bg-black border-r border-white/10 transition-all duration-500 ease-in-out z-30 flex flex-col">

        <!-- Logo Section -->
        <div class="p-6 mb-4 border-b border-white/5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 border border-cyan-500 flex items-center justify-center bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span class="text-white font-black text-xs">SSL</span>
            </div>
            <div *ngIf="!isCollapsed()" class="animate-in fade-in slide-in-from-left-2">
              <h1 class="text-xs font-black uppercase tracking-[0.2em] italic">Command_Core</h1>
              <p class="text-[8px] text-cyan-500 font-mono tracking-widest uppercase">System Administrator</p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar">
          <!-- Main Navigation -->
          <div>
            <p *ngIf="!isCollapsed()" class="px-4 text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-4">Strategic_Grid</p>
            <div class="space-y-1">
              <a *ngFor="let item of mainItems"
                 [routerLink]="item.route"
                 routerLinkActive="active-link"
                 class="group flex items-center px-4 py-3 hover:bg-white/5 transition-all relative">
                <div class="w-5 h-5 mr-4 text-gray-500 group-hover:text-cyan-400 transition-colors" [innerHTML]="item.icon"></div>
                <span *ngIf="!isCollapsed()" class="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">
                  {{ item.label }}
                </span>
                <span *ngIf="!isCollapsed() && item.badge"
                      class="ml-auto bg-red-500 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {{ item.badge }}
                </span>
                <div class="active-bar absolute left-0 top-0 h-full w-1 bg-cyan-500 scale-y-0 transition-transform origin-top"></div>
              </a>
            </div>
          </div>

          <!-- Microservices Section -->
          <div>
            <p *ngIf="!isCollapsed()" class="px-4 text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-4">Microservices_Hub</p>
            <div class="space-y-1">
              <a *ngFor="let service of microservices"
                 [routerLink]="service.route"
                 routerLinkActive="active-link"
                 class="group flex items-center px-4 py-3 hover:bg-white/5 transition-all relative">
                <div class="w-5 h-5 mr-4 text-gray-500 group-hover:text-cyan-400 transition-colors" [innerHTML]="service.icon"></div>
                <span *ngIf="!isCollapsed()" class="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">
                  {{ service.label }}
                </span>
                <div class="active-bar absolute left-0 top-0 h-full w-1 bg-cyan-500 scale-y-0 transition-transform origin-top"></div>
              </a>
            </div>
          </div>

          <!-- Operations -->
          <div>
            <p *ngIf="!isCollapsed()" class="px-4 text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mb-4">Operations_Module</p>
            <div class="space-y-1">
              <a *ngFor="let item of opsItems"
                 [routerLink]="item.route"
                 routerLinkActive="active-link"
                 class="group flex items-center px-4 py-3 hover:bg-white/5 transition-all relative">
                <div class="w-5 h-5 mr-4 text-gray-500 group-hover:text-cyan-400 transition-colors" [innerHTML]="item.icon"></div>
                <span *ngIf="!isCollapsed()" class="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400 group-hover:text-white">
                  {{ item.label }}
                </span>
                <span *ngIf="!isCollapsed() && item.badge"
                      class="ml-auto bg-red-500 text-[9px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {{ item.badge }}
                </span>
                <div class="active-bar absolute left-0 top-0 h-full w-1 bg-cyan-500 scale-y-0 transition-transform origin-top"></div>
              </a>
            </div>
          </div>
        </nav>

        <!-- Footer with Status -->
        <div class="p-6 mt-auto border-t border-white/5 bg-white/[0.01]">
          <div *ngIf="!isCollapsed()" class="mb-4 flex items-center justify-between text-[8px] font-mono uppercase text-gray-500">
            <span>Uplink_Signal</span>
            <span class="text-cyan-500 animate-pulse">Stable_09ms</span>
          </div>
          <button (click)="logout()"
                  class="w-full flex items-center justify-center gap-2 p-3 border border-red-950 text-red-500 hover:bg-red-600 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
            </svg>
            <span *ngIf="!isCollapsed()">Terminate_Session</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col relative overflow-hidden">
        <!-- Top Header -->
        <header class="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-black/40 backdrop-blur-xl z-20">
          <div class="flex items-center gap-6">
            <button (click)="isCollapsed.set(!isCollapsed())"
                    class="text-cyan-500 hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16m-7 6h7"/>
              </svg>
            </button>
            <div>
              <h2 class="text-xl font-black uppercase tracking-tighter italic">{{ getPageTitle() }}</h2>
              <p class="text-[9px] font-mono text-gray-500 uppercase tracking-[0.3em]">Global_Director_Interface</p>
            </div>
          </div>

          <!-- User Info & Actions -->
          <div class="flex items-center gap-4">
            <!-- Notifications -->
            <button class="relative p-2 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all">
              <svg class="w-5 h-5 text-gray-400 hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <!-- Settings -->
            <button [routerLink]="['/admin/settings']"
                    class="p-2 hover:bg-white/5 border border-transparent hover:border-cyan-500/30 transition-all">
              <svg class="w-5 h-5 text-gray-400 hover:text-cyan-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </button>

            <!-- User Profile -->
            <div class="flex items-center gap-3 border-l border-white/10 pl-6">
              <div class="text-right">
                <p class="text-[11px] font-black uppercase tracking-tighter">{{ getUserFullName() || 'Ayoub' }}</p>
                <p class="text-[8px] text-cyan-500 font-mono uppercase tracking-wider">Rank: Director</p>
              </div>
              <div class="w-10 h-10 border border-cyan-500/50 bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center font-black shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {{ getUserInitials() }}
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .active-link {
      background: rgba(6, 182, 212, 0.05);
    }
    .active-link span {
      color: white !important;
    }
    .active-link div {
      color: #06b6d4 !important;
    }
    .active-link .active-bar {
      transform: scaleY(1);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #222;
      border-radius: 2px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #333;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
  `]
})
export class AdminLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private keycloakService = inject(KeycloakService); // ✅ Official service

  isCollapsed = signal(false);

  mainItems: MenuItem[] = [
    {
      label: 'Control Deck',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
      route: '/admin/dashboard'
    },
    {
      label: 'Asset Nodes',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
      route: '/admin/entrepots'
    }
  ];

  microservices: MenuItem[] = [
    {
      label: 'Stock',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      route: '/admin/stock'
    },
    {
      label: 'Vente',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      route: '/admin/vente'
    },
    {
      label: 'Delivery',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>',
      route: '/admin/deliveries'
    },
    {
      label: 'Commande',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>',
      route: '/admin/orders',
      badge: 5
    },
    {
      label: 'Comptabilité',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
      route: '/admin/comptabilite'
    },
    {
      label: 'Payment',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>',
      route: '/admin/payments'
    }
  ];

  opsItems: MenuItem[] = [
    {
      label: 'Staff Roster',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
      route: '/admin/responsables'
    },
    {
      label: 'Products',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      route: '/admin/produits'
    },
    {
      label: 'Suppliers',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
      route: '/admin/suppliers'
    },
    {
      label: 'Mission Logs',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
      route: '/admin/historique',
      badge: 3
    },
    {
      label: 'Reports',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
      route: '/admin/reports'
    },
    {
      label: 'Settings',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
      route: '/admin/settings'
    }
  ];

  logout(): void {
    this.authService.logout();
  }

  getUserInitials(): string {
    const fullName = this.getUserFullName();
    if (!fullName) return 'A';
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
