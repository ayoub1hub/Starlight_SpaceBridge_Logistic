import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  template: `
    <app-navbar></app-navbar>

    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Background Video -->
      <video
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        class="absolute inset-0 w-full h-full object-cover scale-110"
      >
        <source src="assets/videos/vid4.mp4" type="video/mp4" />
      </video>

      <!-- Dark Overlay -->
      <div class="absolute inset-0 bg-black/70"></div>

      <!-- Content -->
      <div class="relative z-10 w-full max-w-4xl px-6 py-32">
        <div class="bg-black border border-white/10 p-10 relative overflow-hidden contact-terminal">
          <div class="absolute inset-0 pointer-events-none scan-line opacity-10"></div>

          <!-- Header -->
          <div class="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
            <h2 class="text-3xl font-black text-white uppercase tracking-tighter italic">
              Establish <span class="text-cyan-500">Uplink</span>
            </h2>
            <div class="flex gap-2">
              <div class="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <div class="w-2 h-2 rounded-full bg-cyan-500/20"></div>
            </div>
          </div>

          <!-- FORM -->
          @if (!submitted()) {
            <form (ngSubmit)="send()" class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-1">
                <label class="label">Vector_ID (Name)</label>
                <input
                  [(ngModel)]="name"
                  name="name"
                  required
                  class="input"
                />
              </div>

              <div class="space-y-1">
                <label class="label">Frequency (Email)</label>
                <input
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  required
                  class="input"
                />
              </div>

              <div class="md:col-span-2 space-y-1">
                <label class="label">Coordinates / Payload</label>
                <textarea
                  rows="4"
                  [(ngModel)]="message"
                  name="message"
                  required
                  class="input"
                ></textarea>
              </div>

              <button
                class="md:col-span-2 spacex-btn py-4"
                [disabled]="loading()"
              >
                {{ loading() ? 'TRANSMITTING…' : 'TRANSMIT PACKAGE' }}
              </button>
            </form>
          }

          <!-- RESPONSE -->
          @if (submitted()) {
            <div class="font-mono text-sm text-cyan-400 space-y-4 animate-fadeIn">
              <p>> Signal locked…</p>
              <p>> Coordinates received.</p>
              <p>> Payload integrity: <span class="text-white">100%</span></p>
              <p>> Status: <span class="text-green-400">UPLINK ESTABLISHED</span></p>
              <p class="text-white pt-4">
                Mission Control will respond shortly.
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-terminal {
      clip-path: polygon(
        0 40px,
        40px 0,
        100% 0,
        100% calc(100% - 40px),
        calc(100% - 40px) 100%,
        0 100%
      );
    }

    .label {
      font-family: monospace;
      font-size: 9px;
      color: #22d3ee;
      text-transform: uppercase;
      letter-spacing: 0.2em;
    }

    .input {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding: 1rem;
      color: white;
      font-family: monospace;
      outline: none;
      transition: border-color 0.3s;
    }

    .input:focus {
      border-color: #22d3ee;
    }

    .spacex-btn {
      border: 1px solid white;
      background: transparent;
      color: white;
      font-family: monospace;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5em;
      transition: all 0.3s ease;
    }

    .spacex-btn:hover {
      background: white;
      color: black;
    }

    @keyframes scan {
      from { transform: translateY(-100%); }
      to { transform: translateY(1000%); }
    }

    .scan-line {
      height: 50px;
      background: linear-gradient(to bottom, transparent, #22d3ee, transparent);
      animation: scan 6s linear infinite;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-fadeIn {
      animation: fadeIn 0.6s ease-out;
    }
  `]
})
export class ContactComponent {
  name = '';
  email = '';
  message = '';

  loading = signal(false);
  submitted = signal(false);

  send(): void {
    this.loading.set(true);

    // Simulated server uplink
    setTimeout(() => {
      this.loading.set(false);
      this.submitted.set(true);
    }, 1800);
  }
}
