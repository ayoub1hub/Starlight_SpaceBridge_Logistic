// src/app/features/public/about/about.component.ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NavbarComponent} from '../../shared/components/navbar';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Video -->
      <video
        #videoElement
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        class="absolute top-0 left-0 w-full h-full object-cover scale-110"
      >
        <source src="assets/videos/vid3.mp4" type="video/mp4" />
      </video>

      <!-- Animated Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 animate-pulse-subtle"></div>

      <!-- Animated Grid Overlay -->
      <div class="absolute inset-0 grid-background opacity-10"></div>

      <!-- Floating Particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="particle particle-1"></div>
        <div class="particle particle-2"></div>
        <div class="particle particle-3"></div>
        <div class="particle particle-4"></div>
        <div class="particle particle-5"></div>
      </div>

      <!-- Content Container -->
      <div class="relative z-20 max-w-7xl mx-auto px-6 py-20">


        <!-- About Us Title -->
        <h6
          class="text-center text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tighter"
          data-text="ABOUT"
        >
          About Us
        </h6>

        <!-- Main Description -->
        <div class="text-center mb-20 animate-fadeInUp animation-delay-400">
          <p class="text-lg md:text-xl lg:text-2xl text-gray-100 mb-6 max-w-5xl mx-auto leading-relaxed font-light tracking-wide">
            We empower global supply chains with
            <span class="text-orange-700 font-medium">intelligent</span>,
            microservice-driven platforms built for
            <span class="text-orange-700 font-medium">reliability</span>,
            <span class="text-orange-700 font-medium">scale</span>, and
            <span class="text-orange-700 font-medium">real-time decision-making</span>.
          </p>

          <p class="text-base md:text-lg text-gray-300 max-w-4xl mx-auto font-light">
            From order to delivery, we ensure every asset reaches its destination—
            <span class="text-orange-400 font-medium">on Earth or beyond</span>.
          </p>
        </div>


        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-fadeInUp animation-delay-600">
          <div class="stat-card group">
            <div class="stat-icon-wrapper">
              <svg class="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div class="counter text-5xl font-black text-white mb-2">99.99<span class="text-cyan-400">%</span></div>
            <div class="text-gray-400 uppercase tracking-widest text-sm font-semibold">Uptime Guarantee</div>
          </div>

          <div class="stat-card group animation-delay-200">
            <div class="stat-icon-wrapper">
              <svg class="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="counter text-5xl font-black text-white mb-2">100<span class="text-orange-400">+</span></div>
            <div class="text-gray-400 uppercase tracking-widest text-sm font-semibold">Countries Served</div>
          </div>

          <div class="stat-card group animation-delay-400">
            <div class="stat-icon-wrapper">
              <svg class="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="counter text-5xl font-black text-white mb-2"><span class="text-purple-400">&lt;</span>1<span class="text-purple-400">s</span></div>
            <div class="text-gray-400 uppercase tracking-widest text-sm font-semibold">Response Time</div>
          </div>
        </div>

        <!-- Mission Statement Box -->
        <div class="mission-box animate-fadeInUp animation-delay-800">
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scan-horizontal"></div>
          <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scan-horizontal-reverse"></div>

          <div class="mb-6 flex items-center justify-center space-x-3">
            <div class="h-px w-12 bg-gradient-to-r from-transparent to-orange-500"></div>
            <svg class="w-8 h-8 text-orange-500 animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            <div class="h-px w-12 bg-gradient-to-l from-transparent to-orange-500"></div>
          </div>

          <h2 class="text-orange-500 font-black text-3xl md:text-4xl mb-4 uppercase tracking-wider">
            Our Mission
          </h2>

          <div class="space-y-6">
            <p class="text-white text-2xl md:text-3xl font-bold tracking-tight">
              Pioneering Mission-Critical Logistics
            </p>
            <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              For space exploration and terrestrial operations, delivering the future of supply chain excellence through cutting-edge technology and uncompromising operational standards.
            </p>
          </div>

          <div class="mt-8 flex items-center justify-center space-x-8">
            <div class="tech-badge">
              <span class="text-cyan-400 font-mono text-sm">REAL-TIME</span>
            </div>
            <div class="tech-badge animation-delay-200">
              <span class="text-purple-400 font-mono text-sm">AI-POWERED</span>
            </div>
            <div class="tech-badge animation-delay-400">
              <span class="text-orange-400 font-mono text-sm">SCALABLE</span>
            </div>
          </div>
        </div>

        <!-- Core Values -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20 animate-fadeInUp animation-delay-1000">
          <div class="value-card">
            <div class="value-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
            <h3 class="text-white text-xl font-bold mb-2 uppercase tracking-wide">Innovation First</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Pushing boundaries with cutting-edge technology and forward-thinking solutions
            </p>
          </div>

          <div class="value-card animation-delay-200">
            <div class="value-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-white text-xl font-bold mb-2 uppercase tracking-wide">Reliability</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Mission-critical performance with zero-tolerance for failure
            </p>
          </div>

          <div class="value-card animation-delay-400">
            <div class="value-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-white text-xl font-bold mb-2 uppercase tracking-wide">Global Scale</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Seamless operations across continents and beyond
            </p>
          </div>

          <div class="value-card animation-delay-600">
            <div class="value-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-white text-xl font-bold mb-2 uppercase tracking-wide">Speed</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Lightning-fast execution from order to delivery
            </p>
          </div>
        </div>

      </div>

      <!-- Scroll Indicator -->
      <div class="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div class="flex flex-col items-center space-y-2 opacity-60">
          <div class="w-6 h-10 border-2 border-white rounded-full flex justify-center p-2">
            <div class="w-1 h-3 bg-white rounded-full animate-scroll"></div>
          </div>
        </div>
      </div>

    </section>
  `,
  styles: `
    /* Core Animations */
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-60px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(40px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes expand {
      from {
        width: 0;
        opacity: 0;
      }
      to {
        width: 8rem;
        opacity: 1;
      }
    }

    @keyframes pulse-subtle {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.95;
      }
    }

    @keyframes float-particle {
      0%, 100% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(30px, -30px) rotate(120deg);
      }
      66% {
        transform: translate(-20px, 20px) rotate(240deg);
      }
    }

    @keyframes scan-horizontal {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    @keyframes scan-horizontal-reverse {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    @keyframes spin-slow {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce-slow {
      0%, 100% {
        transform: translateY(0) translateX(-50%);
      }
      50% {
        transform: translateY(-10px) translateX(-50%);
      }
    }

    @keyframes scroll {
      0% {
        transform: translateY(0);
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: translateY(12px);
        opacity: 0;
      }
    }



    /* Utility Classes */
    .animate-slideDown {
      animation: slideDown 1s ease-out forwards;
    }

    .animate-fadeInUp {
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }

    .animate-expand {
      animation: expand 1.5s ease-out forwards;
    }

    .animate-pulse-subtle {
      animation: pulse-subtle 3s ease-in-out infinite;
    }

    .animate-scan-horizontal {
      animation: scan-horizontal 3s linear infinite;
    }

    .animate-scan-horizontal-reverse {
      animation: scan-horizontal-reverse 4s linear infinite;
    }

    .animate-spin-slow {
      animation: spin-slow 8s linear infinite;
    }

    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }

    .animate-scroll {
      animation: scroll 2s ease-in-out infinite;
    }

    /* Animation Delays */
    .animation-delay-200 { animation-delay: 0.2s; }
    .animation-delay-400 { animation-delay: 0.4s; }
    .animation-delay-600 { animation-delay: 0.6s; }
    .animation-delay-800 { animation-delay: 0.8s; }
    .animation-delay-1000 { animation-delay: 1s; }

    /* Grid Background */
    .grid-background {
      background-image:
        linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: grid-move 20s linear infinite;
    }

    @keyframes grid-move {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(50px, 50px);
      }
    }

    /* Floating Particles */
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(6, 182, 212, 0.5);
      border-radius: 50%;
      animation: float-particle 15s ease-in-out infinite;
    }

    .particle-1 {
      top: 10%;
      left: 10%;
      animation-duration: 12s;
    }

    .particle-2 {
      top: 20%;
      right: 20%;
      animation-duration: 18s;
      animation-delay: 2s;
      background: rgba(251, 146, 60, 0.5);
    }

    .particle-3 {
      bottom: 30%;
      left: 30%;
      animation-duration: 15s;
      animation-delay: 4s;
    }

    .particle-4 {
      bottom: 20%;
      right: 15%;
      animation-duration: 20s;
      animation-delay: 1s;
      background: rgba(168, 85, 247, 0.5);
    }

    .particle-5 {
      top: 50%;
      left: 50%;
      animation-duration: 14s;
      animation-delay: 3s;
    }




    /* Stat Card */
    .stat-card {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2.5rem 2rem;
      border-radius: 4px;
      text-align: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }

    .stat-card:hover {
      background: rgba(0, 0, 0, 0.6);
      border-color: rgba(6, 182, 212, 0.5);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(6, 182, 212, 0.2);
    }

    .stat-icon-wrapper {
      margin-bottom: 1rem;
      transition: transform 0.4s ease;
    }

    .stat-card:hover .stat-icon-wrapper {
      transform: scale(1.2) rotate(360deg);
    }

    .counter {
      line-height: 1;
      transition: all 0.3s ease;
    }

    .stat-card:hover .counter {
      transform: scale(1.1);
    }

    /* Mission Box */
    .mission-box {
      position: relative;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 100%);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 4rem 3rem;
      border-radius: 4px;
      text-align: center;
      overflow: hidden;
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    }

    .mission-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.1), transparent);
      animation: scan-horizontal 3s linear infinite;
    }

    /* Tech Badge */
    .tech-badge {
      padding: 0.5rem 1.5rem;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }

    .tech-badge:hover {
      border-color: rgba(6, 182, 212, 0.6);
      transform: translateY(-4px);
      box-shadow: 0 10px 20px rgba(6, 182, 212, 0.2);
    }

    /* Value Card */
    .value-card {
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-left: 3px solid rgba(6, 182, 212, 0.5);
      padding: 2rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }

    .value-card:hover {
      background: rgba(0, 0, 0, 0.5);
      border-left-color: rgba(6, 182, 212, 1);
      transform: translateX(8px);
      box-shadow: -10px 0 30px rgba(6, 182, 212, 0.15);
    }

    .value-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;

      background: rgba(6, 182, 212, 0.1);
      border-radius: 4px;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
      color: rgb(6, 182, 212);
    }

    .value-card:hover .value-icon {
      background: rgba(6, 182, 212, 0.2);
      transform: scale(1.1) rotate(5deg);
    }


  `
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit() {
    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.play().catch(err => {
        console.error('Video autoplay failed:', err);
      });
    }
  }
}
