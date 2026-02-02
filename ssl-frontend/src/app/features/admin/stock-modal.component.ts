// src/app/features/admin/stock-modal.component.ts
import { Component, EventEmitter, Input, OnInit, Output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StockItem, StockService } from '../../core/services/stock.service';

export interface Product {
  id: string;
  nom: string;
  sku: string;
  unite: string;
}

// Using EntrepotDto from entrepot.service.ts
export interface EntrepotDto {
  id?: string;
  nom: string;
  adresse: string;
  capacite?: number;
  description?: string;
}

@Component({
  selector: 'app-stock-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         (click)="onBackdropClick($event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="bg-white bg-opacity-20 p-2 rounded-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-white">
                {{ isEditMode ? 'Update Stock' : 'Add New Stock' }}
              </h2>
              <p class="text-indigo-100 text-sm">
                {{ isEditMode ? 'Modify stock information' : 'Create a new stock entry' }}
              </p>
            </div>
          </div>
          <button (click)="onClose()"
                  class="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form [formGroup]="stockForm" class="space-y-5">

            <!-- Product Selection -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                Product *
              </label>
              <select formControlName="productId"
                      [disabled]="isEditMode"
                      class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-900 bg-white">
                <option value="" class="text-slate-500 bg-white">Select a product</option>
                @for (product of products(); track product.id) {
                  <option [value]="product.id" class="text-slate-900 bg-white">
                    {{ product.nom }} ({{ product.sku }})
                  </option>
                }
              </select>
              @if (stockForm.get('productId')?.invalid && stockForm.get('productId')?.touched) {
                <p class="text-rose-500 text-xs mt-1">Product is required</p>
              }
            </div>

            <!-- Warehouse Selection -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                Warehouse *
              </label>
              <select formControlName="entrepotId"
                      [disabled]="isEditMode"
                      class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:bg-slate-50 disabled:cursor-not-allowed text-slate-900 bg-white">
                <option value="" class="text-slate-500 bg-white">Select a warehouse</option>
                @for (entrepot of entrepots(); track entrepot.id) {
                  <option [value]="entrepot.id" class="text-slate-900 bg-white">
                    {{ entrepot.nom }} - {{ entrepot.adresse }}
                  </option>
                }
              </select>
              @if (stockForm.get('entrepotId')?.invalid && stockForm.get('entrepotId')?.touched) {
                <p class="text-rose-500 text-xs mt-1">Warehouse is required</p>
              }
            </div>

            <!-- Quantity -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                Available Quantity *
              </label>
              <input type="number"
                     formControlName="quantity"
                     min="0"
                     placeholder="Enter quantity"
                     class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-900 bg-white placeholder:text-slate-400">
              @if (stockForm.get('quantity')?.invalid && stockForm.get('quantity')?.touched) {
                <p class="text-rose-500 text-xs mt-1">Valid quantity is required (min: 0)</p>
              }
            </div>

            <!-- Minimum Stock Level -->
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">
                Minimum Stock Level *
              </label>
              <input type="number"
                     formControlName="minimumQuantity"
                     min="0"
                     placeholder="Enter minimum stock level"
                     class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              @if (stockForm.get('minimumQuantity')?.invalid && stockForm.get('minimumQuantity')?.touched) {
                <p class="text-rose-500 text-xs mt-1">Valid minimum quantity is required (min: 0)</p>
              }
              <p class="text-slate-500 text-xs mt-1">Alert threshold for low stock warnings</p>
            </div>

            <!-- Stock Status Indicator -->
            @if (stockForm.get('quantity')?.value !== null && stockForm.get('minimumQuantity')?.value !== null) {
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-slate-700">Stock Status:</span>
                  @if (stockForm.get('quantity')?.value > stockForm.get('minimumQuantity')?.value) {
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                      ✓ Healthy Stock
                    </span>
                  } @else {
                    <span class="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
                      ⚠ Low Stock Alert
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
                <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <p class="text-sm text-rose-700">{{ errorMessage() }}</p>
              </div>
            }
          </form>
        </div>

        <!-- Footer Actions -->
        <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button type="button"
                  (click)="onClose()"
                  class="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button type="button"
                  (click)="onSubmit()"
                  [disabled]="stockForm.invalid || isSaving()"
                  class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
            @if (isSaving()) {
              <span class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            } @else {
              {{ isEditMode ? 'Update Stock' : 'Create Stock' }}
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class StockModalComponent implements OnInit {
  @Input() stockItem?: StockItem;
  @Input() products = signal<Product[]>([]);
  @Input() entrepots = signal<EntrepotDto[]>([]);

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<StockItem>();

  private fb = inject(FormBuilder);

  stockForm!: FormGroup;
  isEditMode = false;
  isSaving = signal(false);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.isEditMode = !!this.stockItem;
    this.initForm();
  }

  initForm(): void {
    this.stockForm = this.fb.group({
      productId: [
        { value: this.stockItem?.productId || '', disabled: this.isEditMode },
        [Validators.required]
      ],
      entrepotId: [
        { value: this.stockItem?.entrepotId || '', disabled: this.isEditMode },
        [Validators.required]
      ],
      quantity: [
        this.stockItem?.quantity || 0,
        [Validators.required, Validators.min(0)]
      ],
      minimumQuantity: [
        this.stockItem?.minimumQuantity || 0,
        [Validators.required, Validators.min(0)]
      ]
    });
  }

  onSubmit(): void {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formValue = this.stockForm.getRawValue();
    const stockData: StockItem = {
      ...this.stockItem,
      productId: formValue.productId,
      entrepotId: formValue.entrepotId,
      quantity: formValue.quantity,
      minimumQuantity: formValue.minimumQuantity,
      // These will be populated from backend response
      productName: '',
      sku: '',
      unit: 'pcs'
    };

    this.save.emit(stockData);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  setError(message: string): void {
    this.errorMessage.set(message);
    this.isSaving.set(false);
  }

  setSaving(saving: boolean): void {
    this.isSaving.set(saving);
  }
}
