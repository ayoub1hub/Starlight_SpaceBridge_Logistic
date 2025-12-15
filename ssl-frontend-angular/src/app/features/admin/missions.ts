import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-missions',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">NASA Missions Management</h2>
      <p class="text-gray-400">Track and associate supply orders and deliveries directly with active and planned NASA missions. Critical for mission-specific readiness reporting.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Mock Missions:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>**Artemis Phase IV:** Launch Q3 2026. Critical supply status: <span class="text-yellow-400">92% Ready</span></li>
          <li>**Mars Sample Return:** Active. Logistics status: <span class="text-green-400">100% On-Track</span></li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MissionsComponent {}
