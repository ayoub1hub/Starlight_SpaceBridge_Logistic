// src/app/features/admin/orders/orders.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService, PurchaseOrder, PageResponse } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 bg-gray-50 min-h-screen">
      <!-- Header with Actions -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Purchase Orders</h1>
          <p class="text-gray-600 mt-1">Manage and track all purchase orders</p>
        </div>
        <button (click)="openCreateModal()"
                class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
          </svg>
          <span>Create Order</span>
        </button>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-xl shadow-md p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Search -->
          <div class="col-span-2">
            <div class="relative">
              <input type="text"
                     [(ngModel)]="searchTerm"
                     (input)="onSearch()"
                     placeholder="Search orders..."
                     class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Status Filter -->
          <select [(ngModel)]="selectedStatus"
                  (change)="onFilterChange()"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <!-- Date Filter -->
          <input type="date"
                 [(ngModel)]="selectedDate"
                 (change)="onFilterChange()"
                 class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
        </div>
      </div>

      <!-- Orders Grid/List -->
      <div class="grid grid-cols-1 gap-4">
        <div *ngFor="let order of filteredOrders()"
             class="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-6 cursor-pointer"
             (click)="viewOrderDetails(order)">
          <div class="flex items-start justify-between">
            <!-- Order Info -->
            <div class="flex-1">
              <div class="flex items-center space-x-3 mb-2">
                <h3 class="text-lg font-bold text-gray-900">{{ order.orderNumber }}</h3>
                <span [ngClass]="getStatusClass(order.status)"
                      class="px-3 py-1 rounded-full text-xs font-semibold">
                  {{ order.status }}
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p class="text-sm text-gray-500">Supplier</p>
                  <p class="font-semibold text-gray-900">{{ order.supplierName }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Order Date</p>
                  <p class="font-semibold text-gray-900">{{ order.orderDate | date }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Expected Delivery</p>
                  <p class="font-semibold text-gray-900">{{ order.expectedDeliveryDate | date }}</p>
                </div>
              </div>

              <div class="mt-4 flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <span class="text-sm text-gray-600">{{ order.items?.length || 0 }} items</span>
                </div>
                <div class="flex items-center space-x-2">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-semibold text-gray-900">\${{ order.totalAmount.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-2">
              <button (click)="editOrder(order, $event)"
                      class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </button>
              <button (click)="deleteOrder(order, $event)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredOrders().length === 0"
             class="bg-white rounded-xl shadow-md p-12 text-center">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p class="text-gray-600 mb-4">Get started by creating your first purchase order</p>
          <button (click)="openCreateModal()"
                  class="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Create Order
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="filteredOrders().length > 0"
           class="mt-6 flex items-center justify-between bg-white rounded-xl shadow-md p-4">
        <div class="text-sm text-gray-600">
          Showing {{ (currentPage() * pageSize) + 1 }} to {{ Math.min((currentPage() + 1) * pageSize, totalItems()) }} of {{ totalItems() }} results
        </div>
        <div class="flex items-center space-x-2">
          <button (click)="previousPage()"
                  [disabled]="currentPage() === 0"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Previous
          </button>
          <button (click)="nextPage()"
                  [disabled]="(currentPage() + 1) * pageSize >= totalItems()"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<PurchaseOrder[]>([]);
  filteredOrders = signal<PurchaseOrder[]>([]);
  searchTerm = '';
  selectedStatus = '';
  selectedDate = '';
  currentPage = signal(0);
  pageSize = 10;
  totalItems = signal(0);
  Math = Math;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    // Mock data for demonstration - Replace with real API call
    const mockOrders: PurchaseOrder[] = [
      {
        id: '1',
        orderNumber: 'PO-2024-001',
        supplierId: 'SUP001',
        supplierName: 'Acme Supplies Inc.',
        orderDate: new Date('2024-01-15'),
        expectedDeliveryDate: new Date('2024-02-15'),
        status: 'PENDING',
        totalAmount: 15000,
        items: [
          { productId: 'P001', productName: 'Product A', quantity: 100, unitPrice: 100, totalPrice: 10000 },
          { productId: 'P002', productName: 'Product B', quantity: 50, unitPrice: 100, totalPrice: 5000 }
        ]
      },
      {
        id: '2',
        orderNumber: 'PO-2024-002',
        supplierId: 'SUP002',
        supplierName: 'Global Tech Solutions',
        orderDate: new Date('2024-01-20'),
        expectedDeliveryDate: new Date('2024-02-20'),
        status: 'APPROVED',
        totalAmount: 25000,
        items: [
          { productId: 'P003', productName: 'Product C', quantity: 200, unitPrice: 125, totalPrice: 25000 }
        ]
      },
      {
        id: '3',
        orderNumber: 'PO-2024-003',
        supplierId: 'SUP001',
        supplierName: 'Acme Supplies Inc.',
        orderDate: new Date('2024-01-25'),
        expectedDeliveryDate: new Date('2024-02-25'),
        status: 'SHIPPED',
        totalAmount: 18000,
        items: []
      }
    ];

    this.orders.set(mockOrders);
    this.filteredOrders.set(mockOrders);
    this.totalItems.set(mockOrders.length);

    // REAL API CALL (uncomment when backend is ready):
    /*
    this.orderService.getOrders(this.currentPage(), this.pageSize).subscribe({
      next: (response) => {
        this.orders.set(response.content);
        this.filteredOrders.set(response.content);
        this.totalItems.set(response.totalElements);
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
    */
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.orders();

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(order =>
        order.orderNumber?.toLowerCase().includes(term) ||
        order.supplierName?.toLowerCase().includes(term)
      );
    }

    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    this.filteredOrders.set(filtered);
    this.totalItems.set(filtered.length);
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  openCreateModal(): void {
    console.log('Open create order modal');
    alert('Create Order Modal - Implement your form here!');
  }

  viewOrderDetails(order: PurchaseOrder): void {
    console.log('View order:', order);
    alert(`View details for: ${order.orderNumber}`);
  }

  editOrder(order: PurchaseOrder, event: Event): void {
    event.stopPropagation();
    console.log('Edit order:', order);
    alert(`Edit order: ${order.orderNumber}`);
  }

  deleteOrder(order: PurchaseOrder, event: Event): void {
    event.stopPropagation();
    if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
      console.log('Delete order:', order);
      // Implement delete logic
      // this.orderService.deleteOrder(order.id!).subscribe(...)
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
      this.loadOrders();
    }
  }

  nextPage(): void {
    if ((this.currentPage() + 1) * this.pageSize < this.totalItems()) {
      this.currentPage.update(page => page + 1);
      this.loadOrders();
    }
  }
}
