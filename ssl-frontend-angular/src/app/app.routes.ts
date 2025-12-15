// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout';
import { AdminLayoutComponent } from './layouts/admin-layout';
import { HomeComponent } from './features/public/home';



import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // --- Public Routes (wrapped in public layout) ---
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'SSL | Home' },
      {
        path: 'about',
        loadComponent: () =>
          import('./features/public/about').then(m => m.AboutComponent),
        title: 'SSL | About'
      },
      {
        path: 'services',
        loadComponent: () =>
          import('./features/public/services').then(m => m.ServicesComponent),
        title: 'SSL | Services'
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./features/public/contact').then(m => m.ContactComponent),
        title: 'SSL | Contact'
      }
    ]
  },

  // --- Auth Routes (standalone pages, no layout) ---
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component'),
    canActivate: [publicGuard],
    title: 'SSL | Admin Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register.component'),
    canActivate: [publicGuard],
    title: 'SSL | Agency Register'
  },

  // --- Admin Routes (protected, wrapped in admin layout) ---
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard').then(m => m.DashboardComponent),
        title: 'Admin | Dashboard'
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/orders').then(m => m.OrdersComponent),
        title: 'Admin | Orders (Commande)'
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/admin/suppliers').then(m => m.SuppliersComponent),
        title: 'Admin | Suppliers'
      },
      {
        path: 'stock',
        loadComponent: () =>
          import('./features/admin/stock').then(m => m.StockComponent),
        title: 'Admin | Stock'
      },
      {
        path: 'deliveries',
        loadComponent: () =>
          import('./features/admin/deliveries').then(m => m.DeliveriesComponent),
        title: 'Admin | Deliveries (Livraison)'
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/admin/payments').then(m => m.PaymentsComponent),
        title: 'Admin | Payments (Comptabilite)'
      },
      {
        path: 'missions',
        loadComponent: () =>
          import('./features/admin/missions').then(m => m.MissionsComponent),
        title: 'Admin | Missions'
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/admin/reports').then(m => m.ReportsComponent),
        title: 'Admin | Reports'
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/admin/settings').then(m => m.SettingsComponent),
        title: 'Admin | Settings'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // --- Fallback: redirect unknown routes to home ---
  { path: '**', redirectTo: '' }
];
