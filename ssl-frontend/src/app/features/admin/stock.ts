// src/app/features/admin/stock.component.ts
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockItem } from '../../core/services/stock.service';
import { ProductService, Product } from '../../core/services/product.service';
import { EntrepotService, EntrepotDto } from '../../core/services/entrepot.service';
import { StockModalComponent } from './stock-modal.component';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal.component';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, FormsModule, StockModalComponent, DeleteConfirmationModalComponent],
  template: `
    <div class="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Inventory Command</h1>
          <p class="text-slate-600 mt-1">Monitor stock levels and warehouse locations with real-time insights.</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="exportToCSV()"
            [disabled]="isExporting()"
            class="glass-morphism px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed card-hover">
            <span class="flex items-center gap-2">
              @if (!isExporting()) {
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              }
              {{ isExporting() ? 'Exporting...' : 'Export CSV' }}
            </span>
          </button>
          <button
            (click)="openAddProductModal()"
            class="btn-primary">
            <span class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add Product
            </span>
          </button>
        </div>
      </div>

      <!-- Low Stock Alerts -->
      @if (lowStockItems().length > 0) {
        <div class="mb-8">
          <h3 class="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            Critical Stock Alerts ({{ lowStockItems().length }})
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            @for (item of lowStockItems(); track item.id) {
              <div class="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-4 card-hover shadow-glow">
                <div class="bg-gradient-to-r from-rose-500 to-pink-500 text-white p-3 rounded-xl flex-shrink-0 shadow-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-black text-rose-600 uppercase tracking-wider">Critical Low</p>
                  <p class="text-sm font-bold text-slate-900 truncate">{{ item.productName }}</p>
                  <p class="text-xs text-rose-600 font-semibold">Only {{ item.quantity }} {{ item.unit }} remaining</p>
                </div>
              </div>
            }
          </div>
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
        <div class="glass-morphism rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          @if (inventory().length === 0) {
            <div class="p-16 text-center bg-gradient-to-br from-slate-50 to-blue-50">
              <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-200">
                <svg class="w-20 h-20 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <h3 class="text-2xl font-bold text-slate-700 mb-3">No Inventory Items</h3>
                <p class="text-slate-500 mb-6">Start by adding your first product to begin tracking inventory</p>
                <button
                  (click)="openAddProductModal()"
                  class="btn-primary w-full">
                  <span class="flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                    Add Your First Stock Item
                  </span>
                </button>
              </div>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                <tr class="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">Product Details</th>
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">SKU / Serial</th>
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">Warehouse Location</th>
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">Quantity</th>
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-[11px] font-black text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  @for (item of inventory(); track item.id) {
                    <tr class="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group border-b border-slate-50">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">
                            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                          </div>
                          <div>
                            <div class="font-black text-slate-900">{{ item.productName }}</div>
                            <div class="text-xs text-slate-500 font-mono">ID: {{ item.productId }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-mono text-sm font-semibold">
                          {{ item.sku }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs font-bold border border-blue-200">
                          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                          </svg>
                          {{ item.location || 'Unassigned' }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                          <div class="text-lg font-black" [class.text-rose-600]="item.quantity <= item.minimumQuantity" [class.text-emerald-600]="item.quantity > item.minimumQuantity">
                            {{ item.quantity }}
                          </div>
                          <span class="text-[10px] text-slate-400 font-normal bg-slate-100 px-2 py-1 rounded">{{ item.unit }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span [ngClass]="item.quantity > item.minimumQuantity ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200' : 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200'"
                              class="inline-flex items-center px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            @if (item.quantity > item.minimumQuantity) {
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            } @else {
                              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                            }
                          </svg>
                          {{ item.quantity > item.minimumQuantity ? 'In Stock' : 'Refill Required' }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            (click)="openUpdateModal(item)"
                            class="p-2.5 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 text-indigo-600 rounded-xl transition-all duration-200 hover:scale-110 border border-indigo-200"
                            title="Edit stock">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                            </svg>
                          </button>
                          <button
                            (click)="openDeleteModal(item)"
                            class="p-2.5 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-600 rounded-xl transition-all duration-200 hover:scale-110 border border-rose-200"
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
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <div class="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200 flex items-center justify-between">
                <p class="text-sm text-slate-600 font-medium">
                  Showing <span class="font-black text-indigo-600">{{ (currentPage() * pageSize()) + 1 }}</span> to 
                  <span class="font-black text-indigo-600">{{ Math.min((currentPage() + 1) * pageSize(), totalElements()) }}</span> of 
                  <span class="font-black text-indigo-600">{{ totalElements() }}</span> items
                </p>
                <div class="flex gap-2">
                  <button
                    (click)="previousPage()"
                    [disabled]="currentPage() === 0"
                    class="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-sm hover:shadow-md">
                    <span class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                      Previous
                    </span>
                  </button>
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage() >= totalPages() - 1"
                    class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-bold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none">
                    <span class="flex items-center gap-2">
                      Next
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </span>
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
  pageSize = signal(7);
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
      entrepotId = entrepotId;
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
