import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  template: `
    <div class="max-w-md mx-auto p-8 bg-gray-900 my-10 rounded-xl shadow-2xl border border-gray-700">
      <h2 class="text-3xl font-bold text-indigo-400 mb-6">Contact Mission Control</h2>
      <form class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-300">Name</label>
          <input type="text" id="name" class="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300">Email</label>
          <input type="email" id="email" class="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3">
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-300">Message</label>
          <textarea id="message" rows="4" class="mt-1 block w-full rounded-lg border-gray-700 bg-gray-800 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3"></textarea>
        </div>
        <button type="submit" class="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition duration-300">
          Send Transmission
        </button>
      </form>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {}
