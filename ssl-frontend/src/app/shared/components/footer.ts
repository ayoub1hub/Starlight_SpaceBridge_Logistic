import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="relative bg-[#050505] text-white overflow-hidden border-t border-white/5">
      <canvas #starfield class="absolute inset-0 z-0 opacity-40"></canvas>

      <div class="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05)_0%,transparent_50%)]"></div>

      <div class="relative z-20 max-w-[1400px] mx-auto px-6 pt-32 pb-12">

        <div class="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
          <div class="space-y-6 max-w-2xl">
            <div class="inline-flex items-center space-x-3 border border-white/20 px-3 py-1 rounded-full">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span class="text-[10px] tracking-[0.3em] font-mono text-blue-400 uppercase">System Readiness: Optimal</span>
            </div>

            <h2 class="text-5xl md:text-7xl font-bold tracking-tighter leading-none italic uppercase">
              Beyond <br/> <span class="text-transparent stroke-white">Boundaries.</span>
            </h2>
          </div>

          <div class="hidden lg:block relative w-32 h-32 group">
            <svg class="w-full h-full rotate-[-90deg]">
              <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="1" fill="transparent" class="text-white/10" />
              <circle cx="64" cy="64" r="60" stroke="currentColor" stroke-width="1" fill="transparent"
                      class="text-blue-500 transition-all duration-1000 ease-out"
                      stroke-dasharray="377"
                      [attr.stroke-dashoffset]="377 - (377 * 0.75)" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-[10px] font-mono text-gray-500 uppercase">Load</span>
              <span class="text-xl font-bold font-mono tracking-tighter">75%</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 pb-24 border-b border-white/10">
          <div class="col-span-2 lg:col-span-1">

            <p class="text-[11px] text-gray-500 font-mono leading-relaxed uppercase tracking-widest">
              Global Logistics <br> Neural Network
            </p>
          </div>

          <div *ngFor="let section of sections" class="space-y-6">
            <h4 class="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase">{{ section.title }}</h4>
            <ul class="space-y-3">
              <li *ngFor="let link of section.links">
                <a [routerLink]="link.path" class="group flex items-center text-sm text-gray-400 hover:text-white transition-all">
                  <span class="w-0 group-hover:w-4 h-[1px] bg-blue-500 mr-0 group-hover:mr-3 transition-all duration-300"></span>
                  <span class="group-hover:translate-x-1 transition-transform duration-300 uppercase tracking-widest text-[12px]">{{ link.label }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 flex flex-col md:flex-row justify-between items-center font-mono text-[10px] text-gray-600 tracking-[0.2em] uppercase">
          <div class="flex items-center space-x-8">
            <span>&copy; {{ currentYear }} SSL_CORE_OS</span>
            <span class="hidden md:inline text-white/10">|</span>
            <span class="animate-pulse">LAT: 33.9745° N // LONG: 118.3852° W</span>
          </div>
          <div class="mt-4 md:mt-0 flex space-x-6 text-gray-400">
            <a href="#" class="hover:text-blue-400 transition-colors">Neuralink</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Sat_Comm</a>
            <a href="#" class="hover:text-blue-400 transition-colors">Encryption</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host { display: block; }
    .stroke-white {
      -webkit-text-stroke: 1px rgba(255,255,255,0.3);
    }
  `]
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('starfield') canvasRef!: ElementRef<HTMLCanvasElement>;
  currentYear = new Date().getFullYear();
  private ctx!: CanvasRenderingContext2D;
  private stars: any[] = [];
  private animationId!: number;

  sections = [
    {
      title: 'Infrastructure',
      links: [{ label: 'Network', path: '/' }, { label: 'Fleet', path: '/' }, { label: 'Security', path: '/' }]
    },
    {
      title: 'Resources',
      links: [{ label: 'Docs', path: '/' }, { label: 'API', path: '/' }, { label: 'Terminal', path: '/' }]
    },
    {
      title: 'Company',
      links: [{ label: 'Mission', path: '/' }, { label: 'Safety', path: '/' }, { label: 'History', path: '/' }]
    }
  ];

  ngAfterViewInit() {
    this.initStars();
    this.animate();
  }

  private initStars() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5,
        speed: Math.random() * 0.05 + 0.02
      });
    }
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.ctx.fillStyle = 'white';

    this.stars.forEach(star => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      star.y -= star.speed; // Slow upward drift
      if (star.y < 0) star.y = this.canvasRef.nativeElement.height;
    });

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  ngOnInit() {}
  ngOnDestroy() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
  }
}
