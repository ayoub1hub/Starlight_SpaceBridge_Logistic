// src/app/features/admin/delete-confirmation-modal.component.ts
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockItem } from '../../core/services/stock.service';

@Component({
  selector: 'app-delete-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
         (click)="onBackdropClick($event)">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full"
           (click)="$event.stopPropagation()">

        <!-- Header -->
        <div class="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4 flex items-center gap-3">
          <div class="bg-white bg-opacity-20 p-2 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Delete Stock</h2>
            <p class="text-rose-100 text-sm">This action cannot be undone</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4">
            <p class="text-slate-700 mb-3">
              Are you sure you want to delete this stock item?
            </p>

            @if (stockItem) {
              <div class="bg-white rounded-lg p-3 border border-rose-200">
                <div class="flex items-center gap-3">
                  <div class="bg-rose-100 p-2 rounded-lg">
                    <svg class="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="font-bold text-slate-900">{{ stockItem.productName }}</p>
                    <p class="text-xs text-slate-500">SKU: {{ stockItem.sku }}</p>
                    <p class="text-xs text-slate-500">Location: {{ stockItem.location }}</p>
                    <p class="text-xs text-slate-500">Quantity: {{ stockItem.quantity }} {{ stockItem.unit }}</p>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div class="text-sm text-amber-800">
              <p class="font-semibold mb-1">Warning:</p>
              <p>Deleting this stock will permanently remove all associated records and history.</p>
            </div>
          </div>

          @if (errorMessage()) {
            <div class="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 mt-4">
              <svg class="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm text-rose-700">{{ errorMessage() }}</p>
            </div>
          }
        </div>

        <!-- Footer Actions -->
        <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <button type="button"
                  (click)="onClose()"
                  [disabled]="isDeleting()"
                  class="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button type="button"
                  (click)="onConfirm()"
                  [disabled]="isDeleting()"
                  class="px-5 py-2.5 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
            @if (isDeleting()) {
              <span class="flex items-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </span>
            } @else {
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete Stock
              </span>
            }
          </button>
        </div>
      </div>
    </div>
  `
})
export class DeleteConfirmationModalComponent {
  @Input() stockItem?: StockItem;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  isDeleting = signal(false);
  errorMessage = signal<string>('');

  onConfirm(): void {
    this.isDeleting.set(true);
    this.errorMessage.set('');
    this.confirm.emit();
  }

  onClose(): void {
    if (!this.isDeleting()) {
      this.close.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget && !this.isDeleting()) {
      this.onClose();
    }
  }

  setError(message: string): void {
    this.errorMessage.set(message);
    this.isDeleting.set(false);
  }

  setDeleting(deleting: boolean): void {
    this.isDeleting.set(deleting);
  }
}
