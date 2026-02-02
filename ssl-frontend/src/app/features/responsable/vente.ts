// src/app/features/admin/vente.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Sale {
  id: string;
  client: string;
  product: string;
  quantity: number;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

@Component({
  selector: 'app-vente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 space-y-6 bg-gray-50 min-h-full">
      <!-- Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Vente (Sales)</h1>
          <p class="text-gray-600 mt-1">Manage and track all sales transactions</p>
        </div>
        <button (click)="openCreateSaleModal()"
                class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Sale
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Total Sales</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalSales }}</p>
            </div>
            <div class="bg-blue-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Revenue</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalRevenue | number:'1.0-0' }} DH</p>
            </div>
            <div class="bg-green-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">Pending</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ pendingSales }}</p>
            </div>
            <div class="bg-yellow-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-gray-500 text-sm font-medium">This Month</p>
              <p class="text-2xl font-bold text-gray-800 mt-1">{{ monthlySales }}</p>
            </div>
            <div class="bg-purple-100 p-3 rounded-lg">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input [(ngModel)]="searchQuery"
                   type="text"
                   placeholder="Search by client or product..."
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select [(ngModel)]="filterStatus"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date From</label>
            <input [(ngModel)]="dateFrom"
                   type="date"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date To</label>
            <input [(ngModel)]="dateTo"
                   type="date"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          </div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let sale of filteredSales()" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ sale.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ sale.client }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ sale.product }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ sale.quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ sale.amount | number:'1.0-0' }} DH</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span [class]="getStatusClass(sale.status)">
                    {{ sale.status | titlecase }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sale.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <div class="flex gap-2">
                    <button (click)="viewSale(sale.id)"
                            class="text-blue-600 hover:text-blue-800 font-medium">
                      View
                    </button>
                    <button (click)="editSale(sale.id)"
                            class="text-indigo-600 hover:text-indigo-800 font-medium">
                      Edit
                    </button>
                    <button (click)="deleteSale(sale.id)"
                            class="text-red-600 hover:text-red-800 font-medium">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div class="text-sm text-gray-700">
            Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredSales().length }}</span> of <span class="font-medium">{{ sales().length }}</span> results
          </div>
          <div class="flex gap-2">
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              Previous
            </button>
            <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
              1
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              2
            </button>
            <button class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class VenteComponent {
  searchQuery = '';
  filterStatus = 'all';
  dateFrom = '';
  dateTo = '';

  sales = signal<Sale[]>([
    { id: 'VNT-001', client: 'Client ABC', product: 'ProductService A', quantity: 50, amount: 15000, status: 'completed', date: '2024-12-20' },
    { id: 'VNT-002', client: 'Client XYZ', product: 'ProductService B', quantity: 30, amount: 9000, status: 'pending', date: '2024-12-22' },
    { id: 'VNT-003', client: 'Client DEF', product: 'ProductService C', quantity: 100, amount: 45000, status: 'completed', date: '2024-12-23' },
    { id: 'VNT-004', client: 'Client GHI', product: 'ProductService D', quantity: 25, amount: 7500, status: 'pending', date: '2024-12-24' },
    { id: 'VNT-005', client: 'Client JKL', product: 'ProductService E', quantity: 75, amount: 30000, status: 'completed', date: '2024-12-25' },
    { id: 'VNT-006', client: 'Client MNO', product: 'ProductService F', quantity: 40, amount: 12000, status: 'cancelled', date: '2024-12-26' },
    { id: 'VNT-007', client: 'Client PQR', product: 'ProductService G', quantity: 60, amount: 21000, status: 'completed', date: '2024-12-27' },
    { id: 'VNT-008', client: 'Client STU', product: 'ProductService H', quantity: 35, amount: 10500, status: 'pending', date: '2024-12-27' },
  ]);

  get totalSales(): number {
    return this.sales().length;
  }

  get totalRevenue(): number {
    return this.sales()
      .filter(s => s.status === 'completed')
      .reduce((sum, sale) => sum + sale.amount, 0);
  }

  get pendingSales(): number {
    return this.sales().filter(s => s.status === 'pending').length;
  }

  get monthlySales(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.sales().filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    }).length;
  }

  filteredSales = signal<Sale[]>(this.sales());

  ngOnInit() {
    this.filteredSales.set(this.sales());
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  openCreateSaleModal(): void {
    console.log('Opening create sale modal...');
    // TODO: Implement modal for creating new sale
  }

  viewSale(id: string): void {
    console.log('Viewing sale:', id);
    // TODO: Navigate to sale details or open modal
  }

  editSale(id: string): void {
    console.log('Editing sale:', id);
    // TODO: Open edit modal
  }

  deleteSale(id: string): void {
    if (confirm('Are you sure you want to delete this sale?')) {
      console.log('Deleting sale:', id);
      // TODO: Call API to delete sale
      const updatedSales = this.sales().filter(s => s.id !== id);
      this.sales.set(updatedSales);
      this.filteredSales.set(updatedSales);
    }
  }
}
