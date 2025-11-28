import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', loadComponent: () => import('./features/public/home/home.component') },
      { path: 'about', loadComponent: () => import('./features/public/about/about.component') },
      { path: 'services', loadComponent: () => import('./features/public/services/services.component') },
      { path: 'contact', loadComponent: () => import('./features/public/contact/contact.component') },
      { path: 'login', loadComponent: () => import('./features/auth/login/login.component') }
    ]
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/dashboard.component') },
      { path: 'orders', loadComponent: () => import('./features/admin/orders/orders.component') },
      { path: 'suppliers', loadComponent: () => import('./features/admin/suppliers/suppliers.component') },
      { path: 'stock', loadComponent: () => import('./features/admin/stock/stock.component') },
      { path: 'deliveries', loadComponent: () => import('./features/admin/deliveries/deliveries.component') },
      { path: 'payments', loadComponent: () => import('./features/admin/payments/payments.component') },
      { path: 'missions', loadComponent: () => import('./features/admin/missions/missions.component') },
      { path: 'reports', loadComponent: () => import('./features/admin/reports/reports.component') },
      { path: 'settings', loadComponent: () => import('./features/admin/settings/settings.component') }
    ]
  }
];
