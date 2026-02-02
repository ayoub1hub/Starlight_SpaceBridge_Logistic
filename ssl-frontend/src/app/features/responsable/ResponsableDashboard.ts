// src/app/features/responsable/responsable-dashboard.component.ts
import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { StockService, StockMetrics } from '../../core/services/stock.service';

interface ActivityItem {
  action: string;
  time: string;
}

interface StockOverviewItem {
  name: string;
  capacity: number;
  color: string;
}

@Component({
  selector: 'app-responsable-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-black text-white p-8 space-y-10">
      <!-- Header Section with Fixed Entrepot -->
      <div class="bg-gradient-to-r from-black via-emerald-900/20 to-black border border-emerald-500/30 p-10 relative overflow-hidden">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]"></div>
        <div class="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div class="relative z-10">
          <div class="flex items-baseline gap-4 mb-3">
            <h1 class="text-5xl font-black italic uppercase tracking-tighter">
              Welcome, <span class="text-emerald-500">{{ responsableName() }}</span>
            </h1>
          </div>

          <div class="flex items-center gap-4 mt-6">
            <p class="font-mono text-xs text-gray-500 uppercase tracking-[0.3em]">Assigned_Facility:</p>
            <div class="px-6 py-3 bg-emerald-500/10 border border-emerald-500/50">
              <span class="font-mono text-sm text-emerald-400 font-bold uppercase tracking-wider">
                Entrepot_{{ assignedEntrepot() }}
              </span>
            </div>
            <div class="h-6 w-px bg-emerald-500/30"></div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="font-mono text-xs text-emerald-500 uppercase">Status: Operational</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoadingMetrics()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
            <p class="font-mono text-sm text-gray-400">Loading metrics...</p>
          </div>
        </div>
      }

      <!-- Metrics Grid -->
      @if (!isLoadingMetrics()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Stock Products -->
          <div class="group relative border-l-4 border-emerald-500 bg-gradient-to-r from-emerald-500/10 to-black p-8 hover:from-emerald-500/20 transition-all">
            <div class="flex items-start justify-between mb-6">
              <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Stock_Inventory</p>
              <svg class="w-7 h-7 text-emerald-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <p class="text-6xl font-black italic text-white tracking-tighter">{{ metrics()?.totalProducts || 0 }}</p>
            <p class="font-mono text-[9px] text-emerald-500/70 uppercase mt-3 tracking-wider">Units Active</p>
          </div>

          <!-- Low Stock Alert -->
          <div class="group relative border-l-4 border-rose-500 bg-gradient-to-r from-rose-500/10 to-black p-8 hover:from-rose-500/20 transition-all">
            <div class="flex items-start justify-between mb-6">
              <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Low_Stock_Alert</p>
              <svg class="w-7 h-7 text-rose-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <p class="text-6xl font-black italic text-white tracking-tighter">{{ metrics()?.lowStockCount || 0 }}</p>
            <p class="font-mono text-[9px] text-rose-500/70 uppercase mt-3 tracking-wider">Items Need Restock</p>
          </div>

          <!-- Revenue -->
          <div class="group relative border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/10 to-black p-8 hover:from-purple-500/20 transition-all">
            <div class="flex items-start justify-between mb-6">
              <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Inventory_Value</p>
              <svg class="w-7 h-7 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <p class="text-5xl font-black italic text-white tracking-tighter mb-2">
              {{ formatCurrency(metrics()?.totalValue || 0) }}
            </p>
            <p class="font-mono text-[9px] text-purple-500/70 uppercase mt-3 tracking-wider">Total Value</p>
          </div>
        </div>
      }

      <!-- Charts Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Activity Timeline -->
        <div class="bg-black border border-white/10 p-8">
          <div class="flex items-center justify-between mb-8">
            <h3 class="font-mono text-xs text-gray-400 uppercase tracking-wider">Activity_Timeline</h3>
            <div class="h-px flex-1 ml-6 bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
          </div>
          <div class="space-y-4">
            @for (activity of recentActivities(); track activity.action) {
              <div class="flex items-start gap-4 group">
                <div class="w-3 h-3 rounded-full border-2 border-emerald-500 bg-black mt-1 group-hover:bg-emerald-500 transition-colors"></div>
                <div class="flex-1">
                  <p class="text-sm text-white font-medium">{{ activity.action }}</p>
                  <p class="font-mono text-[9px] text-gray-600 uppercase mt-1">{{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Stock Overview -->
        <div class="bg-black border border-white/10 p-8">
          <h3 class="font-mono text-xs text-gray-400 uppercase tracking-wider mb-8">Stock_Allocation</h3>
          <div class="space-y-6">
            @for (stock of stockOverview(); track stock.name) {
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-3 h-3" [class]="stock.color"></div>
                    <span class="font-mono text-[10px] text-gray-400 uppercase">{{ stock.name }}</span>
                  </div>
                  <span class="font-mono text-sm text-white font-bold">{{ stock.capacity }}%</span>
                </div>
                <div class="h-1.5 bg-white/5">
                  <div class="h-full transition-all duration-700" [style.width.%]="stock.capacity" [class]="stock.color"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-6 pt-6">
        <button
          (click)="initializeStock()"
          class="group relative px-12 py-6 bg-emerald-600 hover:bg-emerald-500 transition-all overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]">
          <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
          <span class="relative font-mono text-xs text-black font-black uppercase tracking-[0.3em] flex items-center gap-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"/>
            </svg>
            Initialize_Stock_Manifest
          </span>
        </button>

        <button
          (click)="refreshMetrics()"
          class="group relative px-12 py-6 bg-white/5 border border-emerald-500/30 hover:border-emerald-500 transition-all overflow-hidden">
          <div class="absolute inset-0 bg-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span class="relative font-mono text-xs text-emerald-400 font-bold uppercase tracking-[0.3em] flex items-center gap-4">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh_Data
          </span>
        </button>
      </div>
    </div>
  `
})
export class ResponsableDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private stockService = inject(StockService);

  // Signals for state management
  metrics = signal<StockMetrics | null>(null);
  isLoadingMetrics = signal(true);
  responsableName = signal<string>('Responsable');
  assignedEntrepot = signal<string>('N/A');

  // Activity and stock overview data
  recentActivities = signal<ActivityItem[]>([
    { action: 'Stock Alpha - Inventory Updated', time: '14:32:05' },
    { action: 'New Client Registration - Phoenix Corp', time: '13:18:22' },
    { action: 'Delivery Manifest #4521 Completed', time: '11:45:10' },
    { action: 'Stock Beta - Reorder Alert Triggered', time: '10:22:33' }
  ]);

  stockOverview = signal<StockOverviewItem[]>([
    { name: 'Stock_Alpha', capacity: 85, color: 'bg-emerald-500' },
    { name: 'Stock_Beta', capacity: 72, color: 'bg-cyan-500' },
    { name: 'Stock_Gamma', capacity: 93, color: 'bg-purple-500' },
    { name: 'Stock_Delta', capacity: 68, color: 'bg-orange-500' },
    { name: 'Stock_Epsilon', capacity: 91, color: 'bg-pink-500' }
  ]);

  ngOnInit(): void {
    this.loadResponsableName();
    this.loadAssignedEntrepot();
    this.loadMetrics();
  }

  loadResponsableName(): void {
    // Get user info from Keycloak via AuthService
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      const displayName = userInfo.firstName || userInfo.username || 'Responsable';
      this.responsableName.set(displayName);
      console.log('👤 Responsable name loaded:', displayName);
    } else {
      // Fallback to localStorage or default
      const username = localStorage.getItem('username') || 'Responsable';
      this.responsableName.set(username);
      console.log('👤 Using fallback responsable name:', username);
    }
  }

  loadAssignedEntrepot(): void {
    // Get assigned entrepot from sessionStorage
    const entrepotCode = sessionStorage.getItem('entrepot_code');
    if (entrepotCode) {
      this.assignedEntrepot.set(entrepotCode);
      console.log('🏢 Assigned entrepot loaded:', entrepotCode);
    } else {
      console.warn('⚠️ No entrepot_code found in sessionStorage');
    }
  }

  loadMetrics(): void {
    this.isLoadingMetrics.set(true);

    // Get entrepot ID from sessionStorage
    const entrepotId = sessionStorage.getItem('entrepot_id');

    console.log('📊 Loading metrics for entrepot:', entrepotId);
    console.log('🔗 API URL:', `http://localhost:8080/api/stocks/metrics${entrepotId ? '?entrepotId=' + entrepotId : ''}`);

    this.stockService.getStockMetrics(entrepotId).subscribe({
      next: (data) => {
        console.log('✅ Metrics loaded successfully:', data);
        this.metrics.set(data);
        this.isLoadingMetrics.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading metrics:', error);
        console.error('📍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url
        });
        this.isLoadingMetrics.set(false);

        // Set default metrics on error
        this.metrics.set({
          totalProducts: 0,
          totalValue: 0,
          lowStockCount: 0,
          criticalStockCount: 0
        });

        // Show user-friendly error message
        if (error.status === 0) {
          console.error('⚠️ Backend not reachable. Make sure Spring Boot is running on http://localhost:8080');
        } else if (error.status === 404) {
          console.error('⚠️ Endpoint not found. Check if /api/stocks/metrics exists in your backend');
        } else if (error.status === 403 || error.status === 401) {
          console.error('⚠️ Authentication/Authorization error. Check Keycloak token');
        }
      }
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  initializeStock(): void {
    console.log('🏭 Initialize stock clicked for entrepot:', this.assignedEntrepot());
    alert('Stock initialization feature - Coming soon!');
  }

  refreshMetrics(): void {
    console.log('🔄 Refreshing metrics...');
    this.loadMetrics();
  }
}
