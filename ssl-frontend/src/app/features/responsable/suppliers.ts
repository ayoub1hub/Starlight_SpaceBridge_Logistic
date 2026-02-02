import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">Supplier Management</h2>
      <p class="text-gray-400">This module connects to the Commande Service to manage relationships with key providers of mission supplies, including performance metrics and contract data.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">List of Mock Suppliers:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>AeroSpace Composites Inc.</li>
          <li>CryoFuel Systems LLC</li>
          <li>LifeSupport Solutions Group</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuppliersComponent {}
