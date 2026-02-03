import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, PurchaseOrder } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Loading State -->
      @if (isLoading()) {
        <div class="flex items-center justify-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
            <span class="text-red-800 font-medium">{{ errorMessage() }}</span>
          </div>
        </div>
      }

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Purchase Orders</h1>
          <p class="text-slate-500 mt-1">Real-time logistics management for space-bridge operations.</p>
        </div>
        <button (click)="openCreateModal()"
                class="inline-flex items-center px-6 py-3 bg-indigo-600 border border-transparent text-base font-medium rounded-xl shadow-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105 active:scale-95">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          Create Order
        </button>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="col-span-1 md:col-span-2 relative">
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Search Database</label>
            <div class="relative">
              <input type="text"
                     [(ngModel)]="searchTerm"
                     (input)="onSearch()"
                     placeholder="Order #, Supplier..."
                     class="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none">
              <svg class="w-5 h-5 text-slate-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Status</label>
            <select [(ngModel)]="selectedStatus"
                    (change)="onFilterChange()"
                    class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none appearance-none">
              <option value="">All Systems</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-500 uppercase mb-2 ml-1">Mission Date</label>
            <input type="date"
                   [(ngModel)]="selectedDate"
                   (change)="onFilterChange()"
                   class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none">
          </div>
        </div>
      </div>

      <!-- Orders List -->
      <div class="grid grid-cols-1 gap-5">
        @for (order of orders(); track order.id) {
          <div class="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-indigo-100 transition-all cursor-pointer relative overflow-hidden"
               (click)="viewOrderDetails(order)">
            <div class="absolute top-0 left-0 w-1.5 h-full transition-colors" [ngClass]="getStatusBarClass(order.status)"></div>

            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-sm font-mono font-bold text-slate-400">#{{ order.orderNumber }}</span>
                  <span [ngClass]="getStatusBadgeClass(order.status)" class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
                    {{ order.status }}
                  </span>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Supplier</span>
                    <span class="text-slate-900 font-semibold">{{ order.supplierName }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Launch Date</span>
                    <span class="text-slate-600 font-medium">{{ order.orderDate | date:'mediumDate' }}</span>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Payload Items</span>
                    <span class="text-slate-600 font-medium">{{ order.items.length }} Units</span>
                  </div>
                  <div>
                    <span class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Credit</span>
                    <span class="text-indigo-600 font-bold">\${{ order.totalAmount | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end md:self-center">
                <button (click)="editOrder(order, $event)" class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
                <button (click)="deleteOrder(order, $event)" class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        } @empty {
          @if (!isLoading()) {
            <div class="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
              <div class="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">No Mission Orders Found</h3>
              <p class="text-slate-500 max-w-xs mx-auto mb-8">The logistics gateway is empty. Initiate a new purchase order to start tracking space-bridge cargo.</p>
              <button (click)="openCreateModal()" class="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                Initialize New Order
              </button>
            </div>
          }
        }
      </div>

      <!-- Pagination -->
      @if (orders().length > 0) {
        <div class="mt-10 flex items-center justify-between">
          <p class="text-sm font-medium text-slate-500">
            Total Cargo Missions: <span class="text-slate-900 font-bold">{{ totalElements() }}</span>
          </p>
          <div class="flex gap-3">
            <button (click)="goToPage(currentPage() - 1)"
                    [disabled]="currentPage() === 0 || isLoading()"
                    class="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Previous
            </button>
            <button (click)="goToPage(currentPage() + 1)"
                    [disabled]="(currentPage() + 1) >= totalPages() || isLoading()"
                    class="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              Next
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  // State Management with Signals
  orders = signal<PurchaseOrder[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  isLoading = signal(false);
  errorMessage = signal('');

  // Local Filtering UI
  searchTerm = '';
  selectedStatus = '';
  selectedDate = '';

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    console.log('Loading orders from API Gateway...');

    this.orderService.getOrders(this.currentPage(), 10, this.selectedStatus).subscribe({
      next: (response) => {
        this.orders.set(response.content);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Gateway Connection Failed:', err);

        let errorMsg = 'Failed to load orders. ';
        if (err.status === 0) {
          errorMsg += 'Cannot reach the server. Is the API Gateway running?';
        } else if (err.status === 404) {
          errorMsg += 'Endpoint not found.';
        } else if (err.status === 500) {
          errorMsg += 'Server error.';
        } else {
          errorMsg += 'Please check your connection.';
        }

        this.errorMessage.set(errorMsg);
        this.isLoading.set(false);
        this.orders.set([]);
      }
    });
  }

  onFilterChange(): void {
    this.currentPage.set(0);
    this.loadOrders();
  }

  onSearch(): void {
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrders();
    }
  }

  getStatusBadgeClass(status: string): string {
    const base = 'bg-opacity-10 ';
    switch (status) {
      case 'DELIVERED': return base + 'bg-emerald-500 text-emerald-700';
      case 'PENDING': return base + 'bg-amber-500 text-amber-700';
      case 'SHIPPED': return base + 'bg-blue-500 text-blue-700';
      case 'APPROVED': return base + 'bg-indigo-500 text-indigo-700';
      case 'CANCELLED': return base + 'bg-rose-500 text-rose-700';
      default: return base + 'bg-slate-500 text-slate-700';
    }
  }

  getStatusBarClass(status: string): string {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-500';
      case 'PENDING': return 'bg-amber-500';
      case 'SHIPPED': return 'bg-blue-500';
      case 'APPROVED': return 'bg-indigo-500';
      case 'CANCELLED': return 'bg-rose-500';
      default: return 'bg-slate-200';
    }
  }

  // CREATE ORDER - TEST FUNCTION
  openCreateModal() {
    const testOrder: PurchaseOrder = {
      orderNumber: 'PO-TEST-' + Date.now(),
      supplierName: 'SpaceX Cargo Division',
      supplierId: 'supplier-123',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'APPROVED',
      totalAmount: 50000,
      items: [
        {
          productId: 'prod-123',
          productName: 'Oxygen Tanks',
          quantity: 10,
          unitPrice: 5000,
          totalPrice: 50000
        }
      ]
    };

    this.orderService.createOrder(testOrder).subscribe({
      next: (response) => {
        alert('Order created successfully!');
        this.loadOrders();
      },
      error: (err) => {
        alert('Failed to create order: ' + (err.message || 'Unknown error'));
      }
    });
  }

  viewOrderDetails(order: PurchaseOrder) {
  }

  editOrder(order: PurchaseOrder, event: Event) {
    event.stopPropagation();
  }

  deleteOrder(order: PurchaseOrder, event: Event) {
    event.stopPropagation();
    if (confirm(`Delete order ${order.orderNumber}?`)) {
      this.orderService.deleteOrder(order.id!).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (err) => {
          this.errorMessage.set('Failed to delete order');
        }
      });
    }
  }
}