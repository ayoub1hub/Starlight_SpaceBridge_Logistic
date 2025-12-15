import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <div class="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-3xl font-semibold text-gray-100 mb-4">System Settings</h2>
      <p class="text-gray-400">Configure global application settings, API endpoints, user roles, and multi-tenant security parameters.</p>
      <div class="mt-6 p-4 bg-gray-700 rounded-lg">
        <p class="text-cyan-400">Configuration Status:</p>
        <ul class="list-disc list-inside mt-2 text-sm text-gray-300">
          <li>**API Gateway URL:** <code>http://localhost:8080/api</code> (Active)</li>
          <li>**Multi-Tenant Mode:** Enabled (3 Agencies Active)</li>
          <li>**Notification Service:** Connected (Port 8086)</li>
        </ul>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent {}
