import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-services',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto p-8 bg-gray-900/50 my-10 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-4xl font-bold text-cyan-400 mb-6">Our Space Logistics Services</h2>
      <ul class="space-y-4 text-gray-300 list-disc list-inside">
        <li>🛰️ **Commande Service:** Secure order placement and tracking for space agencies.</li>
        <li>📦 **Stock Service:** Multi-planetary inventory and warehouse optimization.</li>
        <li>🚚 **Livraison Service:** GPS-enabled final-mile (or final-lightyear) delivery tracking.</li>
        <li>💰 **Comptabilite Service:** Automated invoicing, financial reconciliation, and cross-currency payment processing.</li>
      </ul>
      <p class="mt-6 text-gray-400">Each service is powered by a dedicated microservice for unparalleled resilience and scalability.</p>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {}
