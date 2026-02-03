// src/app/app.routes.ts
// Suggestions & improvements marked with // SUGGESTION: ...

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
    // SUGGESTION: add title / data for <title> tag & SEO / breadcrumbs
    data: { title: 'Accueil - SSL Logistics' }
  },
  {
    path: 'about',
    loadComponent: () => import('./features/public/about').then(m => m.AboutComponent),
    canActivate: [publicGuard],
    data: { title: 'À propos' }
  },
  {
    path: 'services',
    loadComponent: () => import('./features/public/services').then(m => m.ServicesComponent),
    canActivate: [publicGuard],
    data: { title: 'Nos services' }
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact').then(m => m.ContactComponent),
    canActivate: [publicGuard],
    data: { title: 'Contact' }
  },

  // ========== AUTHENTICATION FLOW ==========
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/entrepot-login.component').then(m => m.EntrepotLoginComponent),
    // SUGGESTION: mark as public even if no guard → clearer intent
    data: { isPublic: true, title: 'Connexion' }
  },
  {
    path: 'auth/role-selection',
    loadComponent: () => import('./features/auth/role-selection.component').then(m => m.RoleSelectionComponent),
    canActivate: [roleSelectionGuard],
    data: { title: 'Sélection du rôle' }
  },
  {
    path: 'auth/user-login',
    loadComponent: () => import('./features/auth/user-login.component').then(m => m.UserLoginComponent),
    canActivate: [roleSelectionGuard],
    data: { title: 'Authentification Keycloak' }
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/auth-callback.component').then(m => m.AuthCallbackComponent),
    // SUGGESTION: very important → prevent adding token / auth checks here
    data: { skipAuth: true, isCallback: true, title: 'Authentification en cours...' }
  },

  // ========== ADMIN ROUTES ==========
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./layouts/admin-layout').then(m => m.AdminLayoutComponent),
    data: { titlePrefix: 'Admin - ' }, // useful for dynamic titles in layout
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/AdminDashboard').then(m => m.AdminDashboardComponent),
        data: { title: 'Tableau de bord' }
      },

      // Other admin children...
      { path: 'stock',      loadComponent: () => import('./features/admin/stock').then(m => m.StockComponent),      data: { title: 'Stock' } },
      { path: 'vente',      loadComponent: () => import('./features/admin/vente').then(m => m.VenteComponent),      data: { title: 'Ventes' } },
      { path: 'deliveries', loadComponent: () => import('./features/admin/deliveries').then(m => m.DeliveriesComponent), data: { title: 'Livraisons' } },
      { path: 'orders',     loadComponent: () => import('./features/admin/order').then(m => m.OrdersComponent),     data: { title: 'Commandes' } },
      { path: 'payments',   loadComponent: () => import('./features/admin/payments').then(m => m.PaymentsComponent), data: { title: 'Paiements' } },
      { path: 'reports',    loadComponent: () => import('./features/admin/reports').then(m => m.ReportsComponent),   data: { title: 'Rapports' } },
      { path: 'settings',   loadComponent: () => import('./features/admin/settings').then(m => m.SettingsComponent),  data: { title: 'Paramètres' } },
    ]
  },

  // ========== RESPONSABLE ROUTES ==========
  {
    path: 'responsable',
    canActivate: [authGuard, responsableGuard],
    loadComponent: () => import('./layouts/responsable-layout').then(m => m.ResponsableLayoutComponent),
    data: { titlePrefix: 'Responsable - ' },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadComponent: () => import('./features/responsable/ResponsableDashboard').then(m => m.ResponsableDashboardComponent),
        data: { title: 'Tableau de bord' }
      },

      // Keep consistent naming
      { path: 'stock',      loadComponent: () => import('./features/responsable/stock').then(m => m.StockComponent),      data: { title: 'Stock' } },
      { path: 'vente',      loadComponent: () => import('./features/responsable/vente').then(m => m.VenteComponent),      data: { title: 'Ventes' } },
      { path: 'deliveries', loadComponent: () => import('./features/responsable/deliveries').then(m => m.DeliveriesComponent), data: { title: 'Livraisons' } },
      { path: 'orders',     loadComponent: () => import('./features/responsable/order').then(m => m.OrdersComponent),     data: { title: 'Commandes' } },
      { path: 'payments',   loadComponent: () => import('./features/responsable/payments').then(m => m.PaymentsComponent), data: { title: 'Paiements' } },
      { path: 'reports',    loadComponent: () => import('./features/responsable/reports').then(m => m.ReportsComponent),   data: { title: 'Rapports' } },
      { path: 'settings',   loadComponent: () => import('./features/responsable/settings').then(m => m.SettingsComponent),  data: { title: 'Paramètres' } },
    ]
  },

  // ========== FALLBACK ==========
  // SUGGESTION A: better UX → dedicated 404 page instead of forcing login
  // {
  //   path: '**',
  //   loadComponent: () => import('./features/public/not-found').then(m => m.NotFoundComponent),
  //   data: { title: 'Page non trouvée' }
  // }

  // Current version (forcing login is acceptable in strict business apps)
  { path: '**', redirectTo: '/auth/login' }
];
