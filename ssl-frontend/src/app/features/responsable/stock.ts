// src/app/features/admin/stock.component.ts
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockItem } from '../../core/services/stock.service';
import { ProductService, Product } from '../../core/services/product.service';
import { EntrepotService, EntrepotDto } from '../../core/services/entrepot.service';
import { StockModalComponent } from '../admin/stock-modal.component';
import { DeleteConfirmationModalComponent } from '../admin/delete-confirmation-modal.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, StockModalComponent, DeleteConfirmationModalComponent],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900">Inventory Command</h1>
          <p class="text-slate-500">Monitor stock levels and warehouse locations.</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="exportToCSV()"
            [disabled]="isExporting()"
            class="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isExporting() ? 'Exporting...' : 'Export CSV' }}
          </button>
          <button
            (click)="openAddProductModal()"
            class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
            + Add Product
          </button>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      @if (lowStockItems().length > 0) {
        <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (item of lowStockItems(); track item.id) {
            <div class="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4">
              <div class="bg-rose-500 text-white p-2 rounded-lg flex-shrink-0">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-bold text-rose-600 uppercase">Critical Low</p>
                <p class="text-sm font-bold text-slate-900 truncate">{{ item.productName }}</p>
                <p class="text-xs text-rose-500">Only {{ item.quantity }} {{ item.unit }} remaining</p>
              </div>
            </div>
          }
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-12 flex items-center justify-center">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p class="text-slate-500">Loading inventory...</p>
          </div>
        </div>
      }

      <!-- Success/Error Messages -->
      @if (successMessage()) {
        <div class="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-emerald-700 font-medium">{{ successMessage() }}</p>
          <button (click)="successMessage.set('')" class="ml-auto text-emerald-600 hover:text-emerald-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      @if (errorMessage()) {
        <div class="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
          <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          <p class="text-rose-700 font-medium">{{ errorMessage() }}</p>
          <button (click)="errorMessage.set('')" class="ml-auto text-rose-600 hover:text-rose-800">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      }

      <!-- Inventory Table -->
      @if (!isLoading()) {
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          @if (inventory().length === 0) {
            <div class="p-12 text-center">
              <svg class="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <p class="text-slate-500 text-lg font-medium mb-2">No inventory items found</p>
              <p class="text-slate-400 text-sm mb-4">Add your first product to get started</p>
              <button
                (click)="openAddProductModal()"
                class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                + Add Your First Stock Item
              </button>
            </div>
          } @else {
            <table class="w-full text-left border-collapse">
              <thead>
              <tr class="bg-slate-50 border-b border-slate-200">
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Product Details</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">SKU / Serial</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Warehouse Loc</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Quantity</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Status</th>
                <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Actions</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (item of inventory(); track item.id) {
                  <tr class="hover:bg-slate-50 transition-colors group">
                    <td class="px-6 py-4">
                      <div class="font-bold text-slate-900">{{ item.productName }}</div>
                      <div class="text-xs text-slate-400">ID: {{ item.productId }}</div>
                    </td>
                    <td class="px-6 py-4 font-mono text-sm text-slate-500">{{ item.sku }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2"/>
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" stroke-width="2"/>
                        </svg>
                        {{ item.location || 'Unassigned' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm font-bold" [class.text-rose-600]="item.quantity <= item.minimumQuantity">
                        {{ item.quantity }} <span class="text-[10px] text-slate-400 font-normal">{{ item.unit }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span [ngClass]="item.quantity > item.minimumQuantity ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'"
                            class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {{ item.quantity > item.minimumQuantity ? 'In Stock' : 'Refill Required' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          (click)="openUpdateModal(item)"
                          class="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-all"
                          title="Edit stock">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </button>
                        <button
                          (click)="openDeleteModal(item)"
                          class="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-all"
                          title="Delete stock">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                <p class="text-sm text-slate-500">
                  Showing {{ (currentPage() * pageSize()) + 1 }} to {{ Math.min((currentPage() + 1) * pageSize(), totalElements()) }} of {{ totalElements() }} items
                </p>
                <div class="flex gap-2">
                  <button
                    (click)="previousPage()"
                    [disabled]="currentPage() === 0"
                    class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    Previous
                  </button>
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() >= totalPages() - 1"
                    class="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    Next
                  </button>
                </div>
              </div>
            }
          }
        </div>
      }
    </div>

    <!-- Stock Modal (Create/Update) -->
    @if (showStockModal()) {
      <app-stock-modal
        [stockItem]="selectedStock()"
        [products]="products"
        [entrepots]="warehouses"
        (close)="closeStockModal()"
        (save)="onStockSave($event)">
      </app-stock-modal>
    }

    <!-- Delete Confirmation Modal -->
    @if (showDeleteModal()) {
      <app-delete-confirmation-modal
        [stockItem]="selectedStock()"
        (close)="closeDeleteModal()"
        (confirm)="onDeleteConfirm()">
      </app-delete-confirmation-modal>
    }
  `
})
export class StockComponent implements OnInit {
  private stockService = inject(StockService);
  private productService = inject(ProductService);
  private entrepotService = inject(EntrepotService);

  // Signals for state management
  inventory = signal<StockItem[]>([]);
  lowStockItems = signal<StockItem[]>([]);
  products = signal<Product[]>([]);
  warehouses = signal<EntrepotDto[]>([]);

  isLoading = signal(false);
  isExporting = signal(false);

  // Modal state
  showStockModal = signal(false);
  showDeleteModal = signal(false);
  selectedStock = signal<StockItem | undefined>(undefined);

  // Messages
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  // Pagination
  currentPage = signal(0);
  pageSize = signal(50);
  totalPages = signal(0);
  totalElements = signal(0);

  // Expose Math for template
  Math = Math;

  @ViewChild(StockModalComponent) stockModal?: StockModalComponent;
  @ViewChild(DeleteConfirmationModalComponent) deleteModal?: DeleteConfirmationModalComponent;

  ngOnInit(): void {
    this.loadProducts();
    this.loadWarehouses();
    this.loadInventory();
    this.loadLowStockItems();
  }

  /**
   * Load all products for the dropdown
   */
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products.set(products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.showError('Failed to load products');
      }
    });
  }

  /**
   * Load all warehouses for the dropdown
   */
  loadWarehouses(): void {
    this.entrepotService.getAllEntrepots().subscribe({
      next: (entrepots) => {
        this.warehouses.set(entrepots);
      },
      error: (error) => {
        console.error('Error loading warehouses:', error);
        this.showError('Failed to load warehouses');
      }
    });
  }

  /**
   * Load inventory with pagination
   */
  loadInventory(): void {
    this.isLoading.set(true);

    const entrepotCode = sessionStorage.getItem('entrepot_code');
    let entrepotId: string | undefined;

    if (entrepotCode) {
      if (this.isValidUUID(entrepotCode)) {
        entrepotId = entrepotCode;
      } else {
        entrepotId = undefined;
      }
    }

    this.stockService.getStockItems(this.currentPage(), this.pageSize(), entrepotId).subscribe({
      next: (response) => {
        this.inventory.set(response.content);
        this.totalPages.set(response.totalPages);
        this.totalElements.set(response.totalElements);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading inventory:', error);
        this.isLoading.set(false);
        this.handleApiError(error, 'loading inventory');
      }
    });
  }

  /**
   * Load low stock items
   */
  loadLowStockItems(): void {
    const entrepotCode = sessionStorage.getItem('entrepot_code');
    const entrepotId = entrepotCode ? parseInt(entrepotCode, 10) : undefined;

    this.stockService.getLowStockItems(entrepotId).subscribe({
      next: (items) => {
        this.lowStockItems.set(items);
      },
      error: (error) => {
        console.error('Error loading low stock items:', error);
      }
    });
  }

  /**
   * Pagination - Next page
   */
  nextPage(): void {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.update(page => page + 1);
      this.loadInventory();
    }
  }

  /**
   * Pagination - Previous page
   */
  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(page => page - 1);
      this.loadInventory();
    }
  }

  /**
   * Export to CSV
   */
  exportToCSV(): void {
    this.isExporting.set(true);

    const entrepotCode = sessionStorage.getItem('entrepot_code');
    let entrepotId: string | undefined;

    if (entrepotCode && this.isValidUUID(entrepotCode)) {
      entrepotId = entrepotCode;
    } else {
      entrepotId = undefined;
    }

    this.stockService.exportStockToCSV(entrepotId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inventory-export-${new Date().toISOString().split('T')[0]}.csv`;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        this.isExporting.set(false);
        this.showSuccess('Inventory exported successfully');
      },
      error: (error) => {
        console.error('Error exporting CSV:', error);
        this.isExporting.set(false);
        this.showError('Failed to export CSV. Please try again.');
      }
    });
  }

  /**
   * Open modal to add new stock
   */
  openAddProductModal(): void {
    this.selectedStock.set(undefined);
    this.showStockModal.set(true);
  }

  /**
   * Open modal to update stock
   */
  openUpdateModal(item: StockItem): void {
    this.selectedStock.set(item);
    this.showStockModal.set(true);
  }

  /**
   * Open delete confirmation modal
   */
  openDeleteModal(item: StockItem): void {
    this.selectedStock.set(item);
    this.showDeleteModal.set(true);
  }

  /**
   * Close stock modal
   */
  closeStockModal(): void {
    this.showStockModal.set(false);
    this.selectedStock.set(undefined);
  }

  /**
   * Close delete modal
   */
  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedStock.set(undefined);
  }

  /**
   * Handle stock save (create or update)
   */
  onStockSave(stockData: StockItem): void {
    const isUpdate = !!stockData.id;

    const operation = isUpdate
      ? this.stockService.updateStockItem(stockData.id!, stockData)
      : this.stockService.createStockItem(stockData);

    operation.subscribe({
      next: (result) => {
        this.showSuccess(isUpdate ? 'Stock updated successfully' : 'Stock created successfully');
        this.closeStockModal();
        this.loadInventory();
        this.loadLowStockItems();
      },
      error: (error) => {
        console.error('Error saving stock:', error);
        const errorMsg = this.extractErrorMessage(error);
        this.stockModal?.setError(errorMsg);
      }
    });
  }

  /**
   * Handle delete confirmation
   */
  onDeleteConfirm(): void {
    const stockToDelete = this.selectedStock();

    if (!stockToDelete?.id) {
      this.showError('Invalid stock item');
      this.closeDeleteModal();
      return;
    }

    this.stockService.deleteStockItem(stockToDelete.id).subscribe({
      next: () => {
        this.showSuccess(`Stock "${stockToDelete.productName}" deleted successfully`);
        this.closeDeleteModal();
        this.loadInventory();
        this.loadLowStockItems();
      },
      error: (error) => {
        console.error('Error deleting stock:', error);
        const errorMsg = this.extractErrorMessage(error);
        this.deleteModal?.setError(errorMsg);
      }
    });
  }

  /**
   * Helper: Validate UUID
   */
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Helper: Show success message
   */
  private showSuccess(message: string): void {
    this.successMessage.set(message);
    this.errorMessage.set('');

    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.successMessage.set('');
    }, 5000);
  }

  /**
   * Helper: Show error message
   */
  private showError(message: string): void {
    this.errorMessage.set(message);
    this.successMessage.set('');

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.errorMessage.set('');
    }, 8000);
  }

  /**
   * Helper: Extract error message from API response
   */
  private extractErrorMessage(error: any): string {
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.status === 409) {
      return 'This stock item already exists';
    }
    if (error.status === 404) {
      return 'Product or warehouse not found';
    }
    if (error.status === 400) {
      return 'Invalid data provided';
    }
    return 'An error occurred. Please try again.';
  }

  /**
   * Helper: Handle API errors
   */
  private handleApiError(error: any, operation: string): void {
    if (error.status === 0) {
      this.showError('Backend not reachable. Make sure Spring Boot is running.');
    } else if (error.status === 404) {
      this.showError('Endpoint not found. Verify API endpoint exists.');
    } else if (error.status === 403 || error.status === 401) {
      this.showError('Authentication error. Please login again.');
    } else {
      this.showError(`Error ${operation}: ${this.extractErrorMessage(error)}`);
    }
  }
}
