// src/app/shared/components/sidebar/sidebar.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-lg font-bold text-cyan-400">Admin Panel</h2>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <a routerLink="/admin/dashboard" routerLinkActive="bg-gray-700" class="block px-4 py-2 rounded hover:bg-gray-700 transition">
          📊 Dashboard
        </a>
        <a routerLink="/admin/orders" routerLinkActive="bg-gray-700" class="block px-4 py-2 rounded hover:bg-gray-700 transition">
          📦 Orders
        </a>
        <a routerLink="/admin/users" routerLinkActive="bg-gray-700" class="block px-4 py-2 rounded hover:bg-gray-700 transition">
          👥 Users
        </a>
        <!-- Add more links as needed -->
      </nav>
    </aside>
  `,
})
export class SidebarComponent {}
