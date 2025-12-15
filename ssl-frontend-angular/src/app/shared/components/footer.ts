// src/app/shared/components/footer.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 border-t border-gray-700 mt-12 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
        <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <!-- Logo & Copyright -->
          <div class="flex items-center">
            <span class="text-2xl text-cyan-400 font-extrabold mr-2">🛰️</span>
            <span>&copy; {{ currentYear }} SSL - Starlight Spacebridge Logistics. All rights reserved.</span>
          </div>

          <!-- Links -->
          <div class="space-x-4">
            <a [routerLink]="['/about']" class="hover:text-cyan-400 transition duration-150">Privacy Policy</a>
            <a [routerLink]="['/services']" class="hover:text-cyan-400 transition duration-150">Terms of Service</a>
            <a href="mailto:contact@ssl-space.com" class="hover:text-cyan-400 transition duration-150">Contact Us</a>
          </div>
        </div>
        <div class="mt-4 border-t border-gray-800 pt-4 text-xs">
          Built for Mission-Critical Supply Management in partnership with NASA.
        </div>
      </div>
    </footer>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
