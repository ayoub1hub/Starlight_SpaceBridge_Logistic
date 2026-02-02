import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">Financial & Operational Reports</h2>
      <p class="text-gray-400">Generate and view detailed reports covering logistics performance, financial health, inventory turnover, and supplier reliability metrics.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Available Reports:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>Q4 2025 Financial Reconciliation (Comptabilite)</li>
          <li>Delivery Latency Analysis by Destination (Livraison)</li>
          <li>Critical Stock Level Forecast (Stock)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsComponent {}
