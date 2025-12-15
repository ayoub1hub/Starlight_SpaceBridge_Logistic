import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-stock',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">Inventory Control (Stock Service)</h2>
      <p class="text-gray-400">Manage real-time inventory levels across multiple orbital and planetary storage facilities. Integrated with the Notification Service for critical alerts.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Mock Stock Data:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>**Product:** Multi-spectrum Sensor Array - **Stock:** 15 units</li>
          <li>**Product:** Martian Soil Nutrient Packs - **Stock:** 5,000 packs</li>
          <li>**Product:** EVA Suit Oxygen Tanks - **Stock:** 4 (Critical Low)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockComponent {}
