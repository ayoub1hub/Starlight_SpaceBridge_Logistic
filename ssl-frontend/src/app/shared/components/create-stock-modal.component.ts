// src/app/shared/components/create-stock-modal.component.ts
import {Component, signal, inject, output, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockService, StockItem } from '../../core/services/stock.service';

@Component({
  selector: 'app-create-stock-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-hidden">

          <!-- Header -->
          <div class="border-b border-white/10 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white">
                Initialize <span class="text-emerald-500">New Stock</span>
              </h2>
              <button
                (click)="close()"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">

            <!-- Inputs -->
            <ng-container *ngFor="let field of []"></ng-container>

            <!-- Product ID -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Product_ID
              </label>
              <input
                type="text"
                [(ngModel)]="formData.productId"
                name="productId"
                required
                placeholder="Enter product UUID"
                class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
            </div>

            <!-- Product Name -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Product_Name
              </label>
              <input
                type="text"
                [(ngModel)]="formData.productName"
                name="productName"
                required
                placeholder="Enter product name"
                class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
            </div>

            <!-- SKU -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                SKU
              </label>
              <input
                type="text"
                [(ngModel)]="formData.sku"
                name="sku"
                required
                placeholder="Enter SKU"
                class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
            </div>

            <!-- Quantity Grid -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Initial_Quantity
                </label>
                <input
                  type="number"
                  [(ngModel)]="formData.quantity"
                  name="quantity"
                  min="0"
                  required
                  class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
              </div>

              <div>
                <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Minimum_Stock
                </label>
                <input
                  type="number"
                  [(ngModel)]="formData.minimumQuantity"
                  name="minimumQuantity"
                  min="0"
                  required
                  class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
              </div>
            </div>

            <!-- Unit -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Unit
              </label>
              <select
                [(ngModel)]="formData.unit"
                name="unit"
                required
                class="w-full bg-white/5 border border-white/10 focus:border-emerald-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all">
                <option value="pcs">Pieces (pcs)</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
                <option value="m">Meters (m)</option>
                <option value="l">Liters (l)</option>
                <option value="box">Box</option>
                <option value="pallet">Pallet</option>
              </select>
            </div>

            <!-- Error -->
            @if (errorMessage()) {
              <div class="bg-rose-500/10 border border-rose-500/30 p-4">
                <p class="font-mono text-xs text-rose-400">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Actions -->
            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="flex-1 group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 transition-all overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">

                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>

                <span class="relative font-mono text-xs text-black font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  @if (isSubmitting()) {
                    Creating...
                  } @else {
                    Create_Stock
                  }
                </span>
              </button>

              <button
                type="button"
                (click)="close()"
                [disabled]="isSubmitting()"
                class="flex-1 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                <span class="font-mono text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
                  Cancel
                </span>
              </button>
            </div>

          </form>
        </div>
      </div>
    }
  `
})
export class CreateStockModalComponent {
  private stockService = inject(StockService);

  isOpen = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string>('');

  stockCreated = output<StockItem>();

  formData = {
    productId: '',
    productName: '',
    sku: '',
    quantity: 0,
    minimumQuantity: 0,
    unit: 'pcs',
    entrepotId: ''
  };
  @Input() theme!: string;

  open(entrepotId: string): void {
    this.formData.entrepotId = entrepotId;
    this.isOpen.set(true);
    this.errorMessage.set('');
  }

  close(): void {
    this.isOpen.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      productId: '',
      productName: '',
      sku: '',
      quantity: 0,
      minimumQuantity: 0,
      unit: 'pcs',
      entrepotId: ''
    };
    this.errorMessage.set('');
  }

  onSubmit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const stockItem: StockItem = {
      productId: this.formData.productId,
      productName: this.formData.productName,
      sku: this.formData.sku,
      quantity: this.formData.quantity,
      minimumQuantity: this.formData.minimumQuantity,
      unit: this.formData.unit,
      entrepotId: this.formData.entrepotId
    };

    console.log('📦 Creating stock item:', stockItem);

    this.stockService.createStockItem(stockItem).subscribe({
      next: (createdStock) => {
        console.log('✅ Stock created successfully:', createdStock);
        this.isSubmitting.set(false);
        this.stockCreated.emit(createdStock);
        this.close();
      },
      error: (error) => {
        console.error('❌ Error creating stock:', error);
        this.isSubmitting.set(false);

        let errorMsg = 'Failed to create stock. Please try again.';
        if (error.status === 400) {
          errorMsg = 'Invalid data. Please check all fields.';
        } else if (error.status === 404) {
          errorMsg = 'ProductService or Entrepot not found.';
        } else if (error.status === 0) {
          errorMsg = 'Cannot connect to server. Please check if backend is running.';
        }

        this.errorMessage.set(errorMsg);
      }
    });
  }
}
