import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payments',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">Financial Operations (Comptabilite Service)</h2>
      <p class="text-gray-400">Module for managing invoice generation, payment processing, financial reconciliation, and generating regulatory reports.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Mock Financial Summary:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>**Outstanding Invoices:** 12 totaling $4.5M</li>
          <li>**Last Payment Received:** $1.2M from NASA (Order ORD-5090)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsComponent {}
