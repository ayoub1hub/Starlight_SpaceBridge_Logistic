import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { InvoiceService, Invoice } from '../../core/services/invoice.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <div class="flex justify-between items-end mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Operations</h1>
          <p class="text-slate-500 mt-1">Manage invoice generation and financial reconciliation.</p>
        </div>
        <div class="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
          <p class="text-2xl font-black text-rose-600">\${{ totalOutstanding() | number:'1.2-2' }}</p>
        </div>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Invoice #</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Due Date</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Total Amount</th>
              <th class="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase">Status</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (invoice of invoices(); track invoice.id) {
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">{{ invoice.invoiceNumber }}</div>
                  <div class="text-xs text-slate-400 font-mono">Order: {{ invoice.orderId }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-600 font-medium">
                  {{ invoice.dueDate | date:'mediumDate' }}
                </td>
                <td class="px-6 py-4 font-bold text-slate-900">
                  \${{ invoice.totalAmount | number:'1.2-2' }}
                </td>
                <td class="px-6 py-4">
                  <span [ngClass]="getStatusClass(invoice.status)"
                        class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                    {{ invoice.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="markPaid(invoice)" class="text-indigo-600 hover:text-indigo-800 text-sm font-bold">Details</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="px-6 py-20 text-center">
                  <div class="text-slate-300 mb-2">
                    <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-width="2" stroke-linecap="round"/></svg>
                  </div>
                  <p class="text-slate-500 font-medium">No financial records found.</p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class PaymentsComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  invoices = signal<Invoice[]>([]);

  totalOutstanding = computed(() =>
    this.invoices()
      .filter(i => i.status !== 'PAID')
      .reduce((acc, curr) => acc + curr.remainingAmount, 0)
  );

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.invoiceService.getInvoices(0, 10).subscribe({
      next: (res) => this.invoices.set(res.content),
      error: (err) => console.error('Microservice Offline:', err)
    });
  }

  getStatusClass(status: string) {
    if (status === 'PAID') return 'bg-emerald-50 text-emerald-600';
    if (status === 'OVERDUE') return 'bg-rose-50 text-rose-600';
    return 'bg-amber-50 text-amber-600';
  }

  markPaid(invoice: Invoice) { /* Implementation */ }
}
