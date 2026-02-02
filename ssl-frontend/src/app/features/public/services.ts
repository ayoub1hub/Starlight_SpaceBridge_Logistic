import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from '../../shared/components/navbar';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="relative overflow-hidden">
      <!-- Background Video -->
      <video
        #videoElement
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        class="fixed top-0 left-0 w-full h-full object-cover -z-10 scale-110"
      >
        <source src="assets/videos/vid6.mp4" type="video/mp4" />
      </video>

      <!-- Global Overlay -->
      <div class="fixed inset-0 bg-black/75 -z-10"></div>

      <!-- Animated Grid -->
      <div class="fixed inset-0 grid-background opacity-5 -z-10"></div>

      <!-- SERVICE 1: COMMANDE -->
      <section class="min-h-screen flex items-center relative">
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>

        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <!-- Text -->
          <div class="text-white space-y-6 animate-slideRight">
            <div class="inline-block">
              <div class="flex items-center space-x-4 mb-4">
                <div class="h-px w-12 bg-cyan-400"></div>
                <span class="text-cyan-400 font-mono text-sm tracking-widest">01</span>
              </div>
              <h4 class="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 glitch-text" data-text="COMMANDE">
                ORDERS
              </h4>
            </div>

            <p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-xl">
              End-to-end <span class="text-cyan-400 font-semibold">order management</span> covering placement, validation, processing, and real-time tracking to ensure operational accuracy and customer satisfaction.
            </p>

            <div class="flex items-center space-x-6 pt-4">
              <div class="feature-tag">
                <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Real-time</span>
              </div>
              <div class="feature-tag animation-delay-200">
                <svg class="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Validated</span>
              </div>
            </div>
          </div>

          <!-- Image -->
          <div class="relative animate-slideLeft animation-delay-200">
            <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent rounded-lg transform -rotate-2"></div>
            <div class="relative overflow-hidden rounded-lg border border-white/20 shadow-2xl hover-lift">
              <img
                src="assets/images/pic1.jpg"
                alt="Commande"
                class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 right-4 tech-indicator">
                <div class="pulse-dot"></div>
                <span class="text-xs font-mono text-white ml-2">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating particles -->
        <div class="absolute top-1/4 left-10 w-2 h-2 bg-cyan-400 rounded-full animate-float opacity-60"></div>
        <div class="absolute bottom-1/3 right-20 w-3 h-3 bg-orange-400 rounded-full animate-float animation-delay-500 opacity-40"></div>
      </section>

      <!-- DIVIDER -->
      <div class="relative h-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-scan-fast"></div>
        <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(0,0,0,0.4)"></path>
        </svg>
      </div>

      <!-- SERVICE 2: VENTE (INVERTED) -->
      <section class="min-h-screen flex items-center relative bg-black/20">
        <div class="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/40"></div>

        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <!-- Image -->
          <div class="relative animate-slideRight order-2 md:order-1">
            <div class="absolute inset-0 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-lg transform rotate-2"></div>
            <div class="relative overflow-hidden rounded-lg border border-white/20 shadow-2xl hover-lift">
              <img
                src="assets/images/pic4.jpg"
                alt="Vente"
                class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 tech-indicator">
                <div class="pulse-dot bg-orange-400"></div>
                <span class="text-xs font-mono text-white ml-2">LIVE</span>
              </div>
            </div>
          </div>

          <!-- Text -->
          <div class="text-white space-y-6 animate-slideLeft animation-delay-200 order-1 md:order-2">
            <div class="inline-block">
              <div class="flex items-center space-x-4 mb-4">
                <span class="text-orange-400 font-mono text-sm tracking-widest">02</span>
                <div class="h-px w-12 bg-orange-400"></div>
              </div>
              <h4 class="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 glitch-text" data-text="VENTE">
                SALES
              </h4>
            </div>

            <p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-xl">
              Integrated <span class="text-orange-400 font-semibold">sales workflows</span> including customer management, contract handling, invoicing, and revenue tracking with full transparency.
            </p>

            <div class="flex items-center space-x-6 pt-4">
              <div class="feature-tag border-orange-400/30">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>Revenue</span>
              </div>
              <div class="feature-tag border-orange-400/30 animation-delay-200">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span>Contracts</span>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute top-1/3 right-10 w-2 h-2 bg-orange-400 rounded-full animate-float opacity-60"></div>
        <div class="absolute bottom-1/4 left-20 w-3 h-3 bg-cyan-400 rounded-full animate-float animation-delay-700 opacity-40"></div>
      </section>

      <!-- DIVIDER -->
      <div class="relative h-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-l from-transparent via-orange-500/10 to-transparent animate-scan-fast animation-delay-500"></div>
        <svg class="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,70 Q300,120 600,70 T1200,70 L1200,0 L0,0 Z" fill="rgba(0,0,0,0.4)"></path>
        </svg>
      </div>

      <!-- SERVICE 3: LIVRAISON -->
      <section class="min-h-screen flex items-center relative">
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40"></div>

        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <!-- Text -->
          <div class="text-white space-y-6 animate-slideRight">
            <div class="inline-block">
              <div class="flex items-center space-x-4 mb-4">
                <div class="h-px w-12 bg-purple-400"></div>
                <span class="text-purple-400 font-mono text-sm tracking-widest">03</span>
              </div>
              <h4 class="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 glitch-text" data-text="LIVRAISON">
                DELIVERIES
              </h4>
            </div>

            <p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-xl">
              Advanced <span class="text-purple-400 font-semibold">logistics and delivery</span> coordination powered by real-time GPS tracking, route optimization, and status notifications.
            </p>

            <div class="flex items-center space-x-6 pt-4">
              <div class="feature-tag border-purple-400/30">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>GPS Track</span>
              </div>
              <div class="feature-tag border-purple-400/30 animation-delay-200">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span>Optimized</span>
              </div>
            </div>
          </div>

          <!-- Image -->
          <div class="relative animate-slideLeft animation-delay-200">
            <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-lg transform -rotate-2"></div>
            <div class="relative overflow-hidden rounded-lg border border-white/20 shadow-2xl hover-lift">
              <img
                src="assets/images/pic2.jpg"
                alt="Livraison"
                class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 right-4 tech-indicator">
                <div class="pulse-dot bg-purple-400"></div>
                <span class="text-xs font-mono text-white ml-2">TRACKING</span>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute top-1/4 left-10 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60"></div>
        <div class="absolute bottom-1/3 right-20 w-3 h-3 bg-cyan-400 rounded-full animate-float animation-delay-300 opacity-40"></div>
      </section>

      <!-- DIVIDER -->
      <div class="relative h-32 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-scan-fast"></div>
        <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,50 Q300,10 600,50 T1200,50 L1200,120 L0,120 Z" fill="rgba(0,0,0,0.4)"></path>
        </svg>
      </div>

      <!-- SERVICE 4: STOCK (INVERTED) -->
      <section class="min-h-screen flex items-center relative bg-black/20">
        <div class="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-black/40"></div>

        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <!-- Image -->
          <div class="relative animate-slideRight order-2 md:order-1">
            <div class="absolute inset-0 bg-gradient-to-tl from-emerald-500/20 to-transparent rounded-lg transform rotate-2"></div>
            <div class="relative overflow-hidden rounded-lg border border-white/20 shadow-2xl hover-lift">
              <img
                src="assets/images/pic3.jpg"
                alt="Stock"
                class="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute top-4 left-4 tech-indicator">
                <div class="pulse-dot bg-emerald-400"></div>
                <span class="text-xs font-mono text-white ml-2">MONITOR</span>
              </div>
            </div>
          </div>

          <!-- Text -->
          <div class="text-white space-y-6 animate-slideLeft animation-delay-200 order-1 md:order-2">
            <div class="inline-block">
              <div class="flex items-center space-x-4 mb-4">
                <span class="text-emerald-400 font-mono text-sm tracking-widest">04</span>
                <div class="h-px w-12 bg-emerald-400"></div>
              </div>
              <h4 class="text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 glitch-text" data-text="STOCK">
                STOCK
              </h4>
            </div>

            <p class="text-xl md:text-2xl text-gray-300 leading-relaxed font-light max-w-xl">
              Intelligent <span class="text-emerald-400 font-semibold">inventory management</span> with predictive analytics, automated restocking, and full visibility across warehouses.
            </p>

            <div class="flex items-center space-x-6 pt-4">
              <div class="feature-tag border-emerald-400/30">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                <span>Analytics</span>
              </div>
              <div class="feature-tag border-emerald-400/30 animation-delay-200">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span>Auto-restock</span>
              </div>
            </div>
          </div>
        </div>

        <div class="absolute top-1/3 right-10 w-2 h-2 bg-emerald-400 rounded-full animate-float opacity-60"></div>
        <div class="absolute bottom-1/4 left-20 w-3 h-3 bg-orange-400 rounded-full animate-float animation-delay-900 opacity-40"></div>
      </section>

    </section>
  `,

  styles: [`
    /* Core Animations */
    @keyframes slideRight {
      from {
        opacity: 0;
        transform: translateX(-80px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideLeft {
      from {
        opacity: 0;
        transform: translateX(80px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes float {
      0%, 100% {
        transform: translateY(0) translateX(0);
      }
      33% {
        transform: translateY(-20px) translateX(10px);
      }
      66% {
        transform: translateY(10px) translateX(-10px);
      }
    }

    @keyframes scan-fast {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes pulse-glow {
      0%, 100% {
        opacity: 1;
        box-shadow: 0 0 10px currentColor;
      }
      50% {
        opacity: 0.5;
        box-shadow: 0 0 20px currentColor;
      }
    }



    /* Utility Classes */
    .animate-slideRight {
      animation: slideRight 1s ease-out forwards;
    }

    .animate-slideLeft {
      animation: slideLeft 1s ease-out forwards;
    }

    .animate-float {
      animation: float 6s ease-in-out infinite;
    }

    .animate-scan-fast {
      animation: scan-fast 2s linear infinite;
    }

    /* Animation Delays */
    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-300 { animation-delay: 0.3s; }
    .animation-delay-500 { animation-delay: 0.5s; }
    .animation-delay-700 { animation-delay: 0.7s; }
    .animation-delay-900 { animation-delay: 0.9s; }

    /* Grid Background */
    .grid-background {
      background-image:
        linear-gradient(rgba(6, 182, 212, 0.03) 2px, transparent 2px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.03) 2px, transparent 2px);
      background-size: 100px 100px;
      animation: grid-drift 30s linear infinite;
    }

    @keyframes grid-drift {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(100px, 100px);
      }
    }



    /* Feature Tag */
    .feature-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 4px;
      backdrop-filter: blur(10px);
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      transition: all 0.3s ease;
      animation: slideRight 1s ease-out forwards;
      opacity: 0;
    }

    .feature-tag:hover {
      background: rgba(6, 182, 212, 0.1);
      border-color: rgba(6, 182, 212, 0.6);
      transform: translateY(-2px);
    }

    /* Tech Indicator */
    .tech-indicator {
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 4px;
      backdrop-filter: blur(10px);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: rgb(6, 182, 212);
      border-radius: 50%;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    /* Hover Lift Effect */
    .hover-lift {
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .hover-lift:hover {
      transform: translateY(-10px);
      box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8),
      0 0 40px rgba(6, 182, 212, 0.2);
    }

    /* Video Styling */
    video {
      min-width: 100%;
      min-height: 100%;
      filter: brightness(0.7) contrast(1.1);
    }
  `]
})
export class ServicesComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play().catch(err => {
        console.error('Video autoplay failed:', err);
      });
    }
  }
}
