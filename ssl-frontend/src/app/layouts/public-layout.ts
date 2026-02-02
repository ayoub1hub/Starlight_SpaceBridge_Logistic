// src/app/layouts/public-layout/public-layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../shared/components/navbar';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <!-- Navbar Component -->
    <app-navbar></app-navbar>


    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class PublicLayoutComponent {}
