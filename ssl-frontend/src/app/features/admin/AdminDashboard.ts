import { Component, signal, inject, OnInit, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { StockService, StockMetrics } from '../../core/services/stock.service';
import { EntrepotService, EntrepotDto } from '../../core/services/entrepot.service';
import { CreateEntrepotModalComponent } from '../../shared/components/create-entrepot-modal.component';
import { CreateStockModalComponent } from '../../shared/components/create-stock-modal.component';

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CreateEntrepotModalComponent,
    CreateStockModalComponent
  ],
  template: `
    <div class="min-h-screen bg-black text-white p-8 space-y-10">
      <!-- Header Section -->
      <div class="border-b border-white/10 pb-8">
        <div class="flex items-baseline gap-4 mb-3">
          <h1 class="text-6xl font-black italic uppercase tracking-tighter">
            Welcome, <span class="text-cyan-500">{{ adminName() }}</span>
          </h1>
        </div>

        <!-- Entrepot Selector -->
        <div class="flex items-center gap-6 mt-6">
          <p class="font-mono text-xs text-gray-400 uppercase tracking-wider">Active Facility:</p>

          @if (entrepots().length > 0) {
            <div class="relative">
              <select
                [(ngModel)]="selectedEntrepotId"
                (ngModelChange)="onEntrepotChange()"
                [disabled]="entrepots()[0]?.id === 'placeholder'"
                class="bg-white/5 border border-cyan-500/30 hover:border-cyan-500 px-6 py-3 pr-12 font-mono text-sm text-cyan-400 uppercase tracking-wider cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                @for (entrepot of entrepots(); track entrepot.id) {
                  <option [value]="entrepot.id" class="bg-black text-white">{{ entrepot.nom }}</option>
                }
              </select>
              <svg class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div class="h-8 w-px bg-cyan-500/30"></div>
            <p class="font-mono text-xs text-cyan-500 uppercase tracking-wider">
              {{ entrepots()[0]?.id !== 'placeholder' ? entrepots().length + ' Total Facilities Online' : 'No Facilities - Create One Below' }}
            </p>
          } @else {
            <div class="px-6 py-3 bg-rose-500/10 border border-rose-500/30">
              <p class="font-mono text-xs text-rose-400 uppercase tracking-wider">Failed to load entrepots - Check console</p>
            </div>
          }
        </div>

        <!-- No Entrepots Warning -->
        @if (entrepots().length === 0 || entrepots()[0]?.id === 'placeholder') {
          <div class="mt-6 bg-amber-500/10 border border-amber-500/30 p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="font-mono text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                {{ entrepots().length === 0 ? 'Connection Error' : 'No Entrepots Found' }}
              </p>
              <p class="font-mono text-xs text-amber-300/70">
                {{ entrepots().length === 0 ? 'Cannot connect to backend. Open browser console (F12) for details.' : 'Click "Deploy_New_Entrepot" below to create your first warehouse facility.' }}
              </p>
            </div>
          </div>
        }
      </div>

      <!-- Loading State -->
      @if (isLoadingMetrics()) {
        <div class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mb-4"></div>
            <p class="font-mono text-sm text-gray-400">Loading metrics...</p>
          </div>
        </div>
      }

      <!-- Metrics Grid -->
      @if (!isLoadingMetrics()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Stock Metric -->
          <div class="group relative bg-gradient-to-br from-black to-gray-900 border border-white/10 hover:border-cyan-500/50 p-8 transition-all duration-300 overflow-hidden">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all"></div>
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Stock_Units</p>
                <svg class="w-8 h-8 text-cyan-500/30 group-hover:text-cyan-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <p class="text-5xl font-black italic text-white tracking-tighter mb-2">{{ metrics()?.totalProducts || 0 }}</p>
              <div class="flex items-center gap-2 mt-4">
                <div class="h-1 flex-1 bg-white/5">
                  <div class="h-full bg-cyan-500 transition-all duration-500" [style.width.%]="getStockPercentage()"></div>
                </div>
                <span class="font-mono text-[9px] text-cyan-500">{{ getStockPercentage() }}%</span>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert Metric -->
          <div class="group relative bg-gradient-to-br from-black to-gray-900 border border-white/10 hover:border-rose-500/50 p-8 transition-all duration-300 overflow-hidden">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-all"></div>
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Low_Stock_Items</p>
                <svg class="w-8 h-8 text-rose-500/30 group-hover:text-rose-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
              </div>
              <p class="text-5xl font-black italic text-white tracking-tighter mb-2">{{ metrics()?.lowStockCount || 0 }}</p>
              <div class="flex items-center gap-2 mt-4">
                <div class="h-1 flex-1 bg-white/5">
                  <div class="h-full bg-rose-500 transition-all duration-500" [style.width.%]="getLowStockPercentage()"></div>
                </div>
                <span class="font-mono text-[9px] text-rose-500">{{ getLowStockPercentage() }}%</span>
              </div>
            </div>
          </div>

          <!-- Revenue Metric -->
          <div class="group relative bg-gradient-to-br from-black to-gray-900 border border-white/10 hover:border-emerald-500/50 p-8 transition-all duration-300 overflow-hidden">
            <div class="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all"></div>
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-6">
                <p class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em]">Inventory_Value</p>
                <svg class="w-8 h-8 text-emerald-500/30 group-hover:text-emerald-500/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p class="text-5xl font-black italic text-white tracking-tighter mb-2">
                {{ formatCurrency(metrics()?.totalValue || 0) }}
              </p>
              <div class="flex items-center gap-2 mt-4">
                <div class="h-1 flex-1 bg-white/5">
                  <div class="h-full bg-emerald-500 transition-all duration-500" style="width: 92%"></div>
                </div>
                <span class="font-mono text-[9px] text-emerald-500">+12%</span>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Chart Placeholder Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Performance Chart -->
        <div class="bg-black border border-white/10 p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-mono text-xs text-gray-400 uppercase tracking-wider">Performance_Analytics</h3>
            <div class="flex gap-2">
              <button class="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 font-mono text-[9px] text-cyan-500 uppercase">7D</button>
              <button class="px-3 py-1 border border-white/10 font-mono text-[9px] text-gray-500 uppercase hover:border-cyan-500/30 transition-colors">30D</button>
            </div>
          </div>
          <div class="h-64 flex items-end justify-between gap-2">
            @for (bar of chartData(); track $index) {
              <div class="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-500/20 hover:from-cyan-400 hover:to-cyan-400/30 transition-all cursor-pointer"
                   [style.height.%]="bar"></div>
            }
          </div>
          <div class="flex justify-between mt-4">
            @for (label of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']; track label) {
              <span class="font-mono text-[9px] text-gray-600 uppercase">{{ label }}</span>
            }
          </div>
        </div>

        <!-- Distribution Chart -->
        <div class="bg-black border border-white/10 p-8">
          <h3 class="font-mono text-xs text-gray-400 uppercase tracking-wider mb-6">Stock_Distribution</h3>
          <div class="space-y-4">
            @for (item of distributionData(); track item.label) {
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="font-mono text-[10px] text-gray-400 uppercase">{{ item.label }}</span>
                  <span class="font-mono text-sm text-white font-bold">{{ item.value }}%</span>
                </div>
                <div class="h-2 bg-white/5 overflow-hidden">
                  <div class="h-full transition-all duration-700" [style.width.%]="item.value" [class]="item.color"></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-6 pt-6">
        <button
          (click)="deployNewEntrepot()"
          class="group relative px-10 py-5 bg-cyan-600 hover:bg-cyan-500 transition-all overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)]">
          <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
          <span class="relative font-mono text-xs text-black font-black uppercase tracking-[0.3em] flex items-center gap-3">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            Deploy_New_Entrepot
          </span>
        </button>

        <button
          (click)="initializeStock()"
          class="group relative px-10 py-5 bg-white/5 border border-cyan-500/30 hover:border-cyan-500 transition-all overflow-hidden">
          <div class="absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <span class="relative font-mono text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Initialize_Stock
          </span>
        </button>

        <button
          (click)="refreshMetrics()"
          class="group relative px-10 py-5 bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden">
          <span class="relative font-mono text-xs text-gray-400 font-bold uppercase tracking-[0.3em] flex items-center gap-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </span>
        </button>
      </div>
    </div>

    <!-- Modals -->
    <app-create-entrepot-modal
      (entrepotCreated)="onEntrepotCreated($event)" />

    <app-create-stock-modal
      (stockCreated)="onStockCreated()" />
  `
})
export class AdminDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private stockService = inject(StockService);
  private entrepotService = inject(EntrepotService);

  // ViewChild references to modals
  createEntrepotModal = viewChild(CreateEntrepotModalComponent);
  createStockModal = viewChild(CreateStockModalComponent);

  // Signals for state management
  metrics = signal<StockMetrics | null>(null);
  isLoadingMetrics = signal(true);
  selectedEntrepotId = signal<string>('');
  entrepots = signal<EntrepotDto[]>([]);
  adminName = signal<string>('Admin');

  // Chart data signals
  chartData = signal<number[]>([45, 72, 58, 90, 67, 85, 78]);
  distributionData = signal<DistributionItem[]>([
    { label: 'Electronics', value: 35, color: 'bg-cyan-500' },
    { label: 'Furniture', value: 25, color: 'bg-emerald-500' },
    { label: 'Clothing', value: 20, color: 'bg-rose-500' },
    { label: 'Food', value: 15, color: 'bg-amber-500' },
    { label: 'Other', value: 5, color: 'bg-purple-500' }
  ]);

  ngOnInit(): void {
    this.loadAdminName();
    this.loadEntrepots();
  }

  loadAdminName(): void {
    // Get user info from Keycloak via AuthService
    const userInfo = this.authService.getUserInfo();
    if (userInfo) {
      const displayName = userInfo.firstName || userInfo.username || 'Admin';
      this.adminName.set(displayName);
      console.log('👤 Admin name loaded:', displayName);
    } else {
      // Fallback to localStorage or default
      const username = localStorage.getItem('username') || 'Admin';
      this.adminName.set(username);
      console.log('👤 Using fallback admin name:', username);
    }
  }

  loadEntrepots(): void {
    console.log('🏭 Loading all entrepots...');
    console.log('🔗 Calling API:', `${this.entrepotService['API_URL']}`);

    this.entrepotService.getAllEntrepots().subscribe({
      next: (entrepots) => {
        console.log('✅ Entrepots loaded successfully:', entrepots);
        console.log('📊 Number of entrepots:', entrepots.length);

        // If no entrepots in backend, show message and use placeholder
        if (!entrepots || entrepots.length === 0) {
          console.log('⚠️ No entrepots found in database. Use "Deploy New Entrepot" button to create one.');

          // Create a placeholder entrepot so UI doesn't break
          const placeholderEntrepot: EntrepotDto = {
            id: 'placeholder',
            nom: 'No Entrepots Available',
            adresse: 'Please create an entrepot first'
          };
          this.entrepots.set([placeholderEntrepot]);
          this.selectedEntrepotId.set('placeholder');
          this.isLoadingMetrics.set(false);
          return;
        }

        this.entrepots.set(entrepots);
        console.log('✅ Entrepots set in component:', this.entrepots());

        // Set first entrepot as selected if available
        const savedEntrepotId = sessionStorage.getItem('entrepot_id');
        console.log('💾 Saved entrepot ID from session:', savedEntrepotId);

        const entrepotToSelect = savedEntrepotId && entrepots.find(e => e.id === savedEntrepotId)
          ? savedEntrepotId
          : entrepots[0].id!;

        console.log('🎯 Selected entrepot ID:', entrepotToSelect);
        this.selectedEntrepotId.set(entrepotToSelect);
        sessionStorage.setItem('entrepot_id', entrepotToSelect);

        // Now load metrics for selected entrepot
        this.loadMetrics();
      },
      error: (error) => {
        console.error('❌ Error loading entrepots:', error);
        console.error('📍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          url: error.url,
          error: error.error
        });

        // Show user-friendly error messages
        if (error.status === 0) {
          console.error('⚠️ CORS or Network Error - Backend not reachable');
          console.error('   Make sure:');
          console.error('   1. API Gateway is running on http://localhost:8080');
          console.error('   2. STOCK-SERVICE is running and registered with Eureka');
          console.error('   3. CORS is configured to allow http://localhost:4200');
        } else if (error.status === 404) {
          console.error('⚠️ Endpoint not found');
          console.error('   /api/warehouses endpoint does not exist in backend');
        } else if (error.status === 403 || error.status === 401) {
          console.error('⚠️ Authentication error');
          console.error('   Keycloak token might be invalid or missing');
          console.error('   Check if you are logged in');
        } else if (error.status === 500) {
          console.error('⚠️ Server error');
          console.error('   Check backend logs for details');
        }

        this.isLoadingMetrics.set(false);

        // Don't set fallback data - let user know there's a real issue
        this.entrepots.set([]);
      }
    });
  }

  loadMetrics(): void {
    this.isLoadingMetrics.set(true);
    const entrepotId = this.selectedEntrepotId();

    console.log('📊 Loading metrics for entrepot:', entrepotId);

    this.stockService.getStockMetrics(entrepotId).subscribe({
      next: (data) => {
        console.log('✅ Metrics loaded successfully:', data);
        this.metrics.set(data);
        this.isLoadingMetrics.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading metrics:', error);
        this.isLoadingMetrics.set(false);

        // Set default metrics on error
        this.metrics.set({
          totalProducts: 0,
          totalValue: 0,
          lowStockCount: 0,
          criticalStockCount: 0
        });
      }
    });
  }

  onEntrepotChange(): void {
    console.log('🔄 Entrepot changed to:', this.selectedEntrepotId());
    sessionStorage.setItem('entrepot_id', this.selectedEntrepotId());
    this.loadMetrics();
  }

  getStockPercentage(): number {
    const total = this.metrics()?.totalProducts || 0;
    // Assuming max capacity of 1000 products
    return Math.min((total / 1000) * 100, 100);
  }

  getLowStockPercentage(): number {
    const total = this.metrics()?.totalProducts || 1;
    const lowStock = this.metrics()?.lowStockCount || 0;
    return total > 0 ? (lowStock / total) * 100 : 0;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  deployNewEntrepot(): void {
    console.log('🏭 Opening deploy entrepot modal...');
    this.createEntrepotModal()?.open();
  }

  initializeStock(): void {
    console.log('📦 Opening initialize stock modal...');
    const currentEntrepotId = this.selectedEntrepotId();
    if (!currentEntrepotId) {
      alert('Please select an entrepot first!');
      return;
    }
    this.createStockModal()?.open(currentEntrepotId);
  }

  onEntrepotCreated(entrepot: EntrepotDto): void {
    console.log('✅ New entrepot created:', entrepot);
    // Reload entrepots list
    this.loadEntrepots();
  }

  onStockCreated(): void {
    console.log('✅ New stock created');
    // Reload metrics
    this.loadMetrics();
  }

  refreshMetrics(): void {
    console.log('🔄 Refreshing metrics...');
    this.loadMetrics();
  }
}
