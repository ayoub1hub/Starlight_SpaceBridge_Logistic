import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="max-w-4xl mx-auto p-8 bg-gray-900/50 my-10 rounded-xl shadow-lg border border-gray-700">
      <h2 class="text-4xl font-bold text-cyan-400 mb-6">About SSL Logistics</h2>
      <p class="text-gray-300">Starlight Spacebridge Logistics is pioneering the next generation of supply chain management, specializing in high-value, mission-critical assets for extraterrestrial deployment. We are driven by the belief that robust logistics are the foundation of successful space exploration.</p>
      <div class="mt-6 p-4 bg-gray-800 rounded-lg border border-indigo-700">
        <p class="text-indigo-400 font-medium">Core Mission: Enabling deep-space logistics with 99.99% reliability.</p>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
