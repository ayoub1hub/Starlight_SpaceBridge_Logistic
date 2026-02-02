// src/app/app.routes.ts
// FULLY CORRECTED VERSION - All routes aligned with sidebar

import { Routes } from '@angular/router';
import {
  adminGuard,
  responsableGuard,
  publicGuard,
  authGuard,
  roleSelectionGuard,
} from './core/guards/auth.guard';

export const routes: Routes = [
  // ========== ROOT REDIRECT ==========
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },

  // ========== PUBLIC ROUTES ==========
  {
    path: 'home',
    loadComponent: () => import('./features/public/home').then(m => m.HomeComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./features/public/about').then(m => m.AboutComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'services',
    loadComponent: () => import('./features/public/services').then(m => m.ServicesComponent),
    canActivate: [publicGuard],
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact').then(m => m.ContactComponent),
    canActivate: [publicGuard],
  },

  // ========== AUTHENTICATION FLOW (3 steps) ==========
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/entrepot-login.component').then(m => m.EntrepotLoginComponent),
  },
  {
    path: 'auth/role-selection',
    loadComponent: () => import('./features/auth/role-selection.component').then(m => m.RoleSelectionComponent),
    canActivate: [roleSelectionGuard],
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/auth-callback.component').then(m => m.AuthCallbackComponent),
  },

  // ========== ADMIN ROUTES (protected) ==========
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./layouts/admin-layout').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // Main Navigation
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/AdminDashboard').then(m => m.AdminDashboardComponent)
      },

      // Microservices - ALL FIXED AND UNCOMMENTED
      {
        path: 'stock',
        loadComponent: () => import('./features/admin/stock').then(m => m.StockComponent)
      },
      {
        path: 'vente',
        loadComponent: () => import('./features/admin/vente').then(m => m.VenteComponent)
      },
      {
        path: 'deliveries',
        loadComponent: () => import('./features/admin/deliveries').then(m => m.DeliveriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/order').then(m => m.OrdersComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/admin/payments').then(m => m.PaymentsComponent)
      },
      {
        path: 'produits',
        loadComponent: () => import('./core/services/product.service').then(m => m.ProductService)
      },
      {
        path: 'suppliers',
        loadComponent: () => import('./features/admin/comptabilite').then(m => m.SuppliersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/admin/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/admin/settings').then(m => m.SettingsComponent)
      },
    ]
  },

  // ========== RESPONSABLE ROUTES (protected) ==========
  {
    path: 'responsable',
    canActivate: [authGuard, responsableGuard],
    loadComponent: () => import('./layouts/responsable-layout').then(m => m.ResponsableLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/responsable/ResponsableDashboard').then(m => m.ResponsableDashboardComponent)
      },
      {
        path: 'stock',
        // ✅ FIXED: Changed from StockComponent to ResponsableStockComponent
        loadComponent: () => import('./features/responsable/stock').then(m => m.StockComponent)
      },
      {
        path: 'vente',
        loadComponent: () => import('./features/responsable/vente').then(m => m.VenteComponent)
      },
      {
        path: 'deliveries',
        loadComponent: () => import('./features/responsable/deliveries').then(m => m.DeliveriesComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/responsable/order').then(m => m.OrdersComponent)
      },
      {
        path: 'payments',
        loadComponent: () => import('./features/responsable/payments').then(m => m.PaymentsComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./features/responsable/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/responsable/settings').then(m => m.SettingsComponent)
      },
    ]
  },

  // ========== FALLBACK ==========
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];
