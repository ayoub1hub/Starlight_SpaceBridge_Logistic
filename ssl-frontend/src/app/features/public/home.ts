// src/app/features/public/home.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar';
import { AboutComponent } from '../public/about';
import { ServicesComponent } from '../public/services';
import { ContactComponent } from '../public/contact';
import { FooterComponent } from '../../shared/components/footer';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    AboutComponent,
    NavbarComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <section id="home" class="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <video autoplay muted loop playsinline class="absolute inset-0 w-full h-full object-cover opacity-60">
        <source src="assets/videos/vid1.mp4" type="video/mp4" />
      </video>

      <div class="absolute inset-0 z-10 pointer-events-none border-[20px] border-white/5">

        <div class="absolute bottom-10 right-10 font-mono text-[10px] text-white/20 uppercase">
          Transmission Protocol: v4.2.0-Alpha
        </div>
      </div>

      <div class="relative z-20 max-w-5xl mx-auto px-6 text-center">
        <h4 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight animate-fadeInUp">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-400 to-gray-600">
            SSL Logistics
          </span>
        </h4>
        <p class="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-light animate-fadeInUp animation-delay-300">
          Streamline your supply chain with intelligent, space-grade logistics solutions
        </p>

        <a href="#services" class="group relative inline-flex items-center px-12 py-4 bg-transparent border border-white/20 overflow-hidden">
          <div class="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span class="relative z-10 text-white group-hover:text-black font-mono font-bold tracking-widest uppercase">Initiate Protocol</span>
        </a>
      </div>

      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
        <div class="w-px h-20 bg-gradient-to-b from-transparent via-white to-transparent"></div>
      </div>
    </section>

    <div id="about"><app-about></app-about></div>
    <div id="services"><app-services></app-services></div>
    <div id="contact"><app-contact></app-contact></div>
    <app-footer></app-footer>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-in { animation: fadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `]
})
export class HomeComponent implements AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  async ngOnInit() {
    // Check if user is already authenticated
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      const role = this.authService.selectedRole();
      if (role === 'admin') {
        this.router.navigate(['/admin/dashboard']);
      } else if (role === 'responsable') {
        this.router.navigate(['/responsable/dashboard']);
      } else {
        // If no role selected, go to role selection
        this.router.navigate(['/auth/role-selection']);
      }
    }
  }

  @ViewChild('homeSection') homeSection!: ElementRef;

  ngAfterViewInit() {
    // Existing scroll behavior or animations can go here if needed
  }
}
