import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { RouterLink } from '@angular/router';

interface StatCard {
  title: string;
  value: number | string;
  icon: string;
  color: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-10">
      <!-- Welcome Section -->
      <div class="bg-gray-800 p-8 rounded-xl shadow-lg border border-cyan-700/50">
        <h2 class="text-3xl font-semibold text-cyan-400">SSL Operational Overview</h2>
        <p class="mt-2 text-gray-300">Real-time statistics and mission readiness status for Starlight Spacebridge Logistics.</p>
      </div>

      <!-- Key Metrics -->
      <h3 class="text-2xl font-medium text-gray-100 border-b border-gray-700 pb-2">Key Metrics</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats(); track stat.title) {
          <a
            [routerLink]="[stat.link]"
            class="block p-5 rounded-xl shadow-xl transition duration-300 hover:scale-[1.03]"
            [class]="stat.color"
          >
            <div class="flex items-center justify-between">
              <div class="text-3xl" [innerHTML]="getSafeIcon(stat.icon)"></div>
              <p class="text-sm font-medium opacity-80">{{ stat.title }}</p>
            </div>
            <p class="mt-4 text-4xl font-bold">{{ stat.value }}</p>
            <p class="text-xs mt-2 opacity-70">View Details →</p>
          </a>
        }
      </div>

      <!-- Quick Links / Recent Activity Placeholder -->
      <h3 class="text-2xl font-medium text-gray-100 border-b border-gray-700 pb-2 mt-12">Recent Activity</h3>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h4 class="text-xl font-semibold mb-4 text-white">Recent Mission Orders (NASA)</h4>
          <p class="text-gray-400">Placeholder for a list of the 5 most recent orders from the Commande Service.</p>
          <ul class="mt-4 space-y-2">
            <li class="p-3 bg-gray-700 rounded-lg text-sm flex justify-between items-center">
              <span class="text-cyan-300">#ORD-5091</span>
              <span>Lunar Base Supplies</span>
              <span class="text-green-400">✅ Delivered</span>
            </li>
            <li class="p-3 bg-gray-700 rounded-lg text-sm flex justify-between items-center">
              <span class="text-cyan-300">#ORD-5090</span>
              <span>Mars Rover Parts</span>
              <span class="text-yellow-400">🚚 In Transit</span>
            </li>
          </ul>
        </div>

        <div class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h4 class="text-xl font-semibold mb-4 text-white">Low Stock Alerts</h4>
          <p class="text-red-400 font-semibold">4 critical items need reordering.</p>
          <ul class="mt-4 space-y-2">
            <li class="text-sm text-gray-300">Cryogenic Fuel Tanks (2 in stock)</li>
            <li class="text-sm text-gray-300">Life Support Filters (5 in stock)</li>
          </ul>
          <a [routerLink]="['/admin/stock']" class="mt-4 block text-sm text-indigo-400 hover:text-indigo-300">
            Go to Stock Management →
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<StatCard[]>([]);

  // Inline SVGs (Lucide icon equivalents)
  private readonly iconPackage = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="m21 8.5-9-5.15-9 5.15"/><path d="M3.5 12.5v5.15l9 5.15 9-5.15v-5.15"/><path d="m12 3.33 9 5.15"/><path d="M12 22.82V12.5"/></svg>`;

  private readonly iconTruck = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-4"/><path d="M12 18V9"/><path d="M22 9h-6a2 2 0 0 0-2 2v7"/><path d="M7 18a3 3 0 0 0 3 3h4"/><path d="M17 21a3 3 0 0 0 3-3h-6a3 3 0 0 0 3 3z"/></svg>`;

  private readonly iconDollarSign = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

  private readonly iconWarehouse = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"/><path d="M4 12v8a2 2 0 0 0 2 2h4"/><path d="M14 12v8a2 2 0 0 0 2 2h4"/><path d="M22 12V6a2 2 0 0 0-2-2h-8"/><path d="M4 12h16"/><path d="M2 18h20"/><path d="m14 2 8 4-8 4-8-4 8-4z"/></svg>`;

  ngOnInit(): void {
    this.loadStats();
  }

  // Method to safely return icon HTML (Angular will sanitize it)
  getSafeIcon(icon: string): string {
    return icon;
  }

  // Simulates fetching data from multiple microservices
  loadStats(): void {
    // In production, replace with actual API calls:
    // this.api.getDashboardStats().subscribe(data => this.stats.set(data));

    const mockStats: StatCard[] = [
      {
        title: 'Active Orders',
        value: 125,
        icon: this.iconPackage,
        color: 'bg-indigo-700 hover:bg-indigo-600 text-white',
        link: '/admin/orders'
      },
      {
        title: 'Pending Deliveries',
        value: 18,
        icon: this.iconTruck,
        color: 'bg-cyan-700 hover:bg-cyan-600 text-white',
        link: '/admin/deliveries'
      },
      {
        title: 'Total Inventory Value',
        value: '$12.4M',
        icon: this.iconDollarSign,
        color: 'bg-green-700 hover:bg-green-600 text-white',
        link: '/admin/payments'
      },
      {
        title: 'Low Stock Alerts',
        value: 4,
        icon: this.iconWarehouse,
        color: 'bg-red-700 hover:bg-red-600 text-white',
        link: '/admin/stock'
      }
    ];

    this.stats.set(mockStats);
  }
}
