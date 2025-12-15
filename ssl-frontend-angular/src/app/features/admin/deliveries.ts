import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">Delivery Tracking (Livraison Service)</h2>
      <p class="text-gray-400">Monitor all current, pending, and completed space transport missions. Provides GPS-enabled tracking data for delivery drivers/drones.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Mock Delivery Status:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>**Delivery #LIV-0045:** En route to Europa, ETA: 45 days. **Status:** Hyper-jump complete.</li>
          <li>**Delivery #LIV-0044:** Delivered to ISS on 2025-11-20. **Status:** Proof of Delivery signed by Commander.</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveriesComponent {}
