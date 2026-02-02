// src/app/shared/components/create-entrepot-modal.component.ts
import { Component, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrepotService, EntrepotDto } from '../../core/services/entrepot.service';

@Component({
  selector: 'app-create-entrepot-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="relative w-full max-w-2xl bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden">
          <!-- Header -->
          <div class="border-b border-white/10 p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-black italic uppercase tracking-tighter text-white">
                Deploy <span class="text-cyan-500">New Entrepot</span>
              </h2>
              <button
                (click)="close()"
                class="text-gray-400 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Form -->
          <form (ngSubmit)="onSubmit()" class="p-6 space-y-6">
            <!-- Entrepot Name -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Entrepot_Name
              </label>
              <input
                type="text"
                [(ngModel)]="formData.nom"
                name="nom"
                required
                placeholder="e.g., Entrepot_Central_01"
                class="w-full bg-white/5 border border-white/10 focus:border-cyan-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all">
            </div>

            <!-- Address -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Address
              </label>
              <input
                type="text"
                [(ngModel)]="formData.adresse"
                name="adresse"
                required
                placeholder="Enter warehouse address"
                class="w-full bg-white/5 border border-white/10 focus:border-cyan-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all">
            </div>

            <!-- Capacity -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Capacity (Optional)
              </label>
              <input
                type="number"
                [(ngModel)]="formData.capacite"
                name="capacite"
                min="0"
                placeholder="Maximum capacity in units"
                class="w-full bg-white/5 border border-white/10 focus:border-cyan-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all">
            </div>

            <!-- Description -->
            <div>
              <label class="block font-mono text-xs text-gray-400 uppercase tracking-wider mb-2">
                Description (Optional)
              </label>
              <textarea
                [(ngModel)]="formData.description"
                name="description"
                rows="3"
                placeholder="Enter warehouse description"
                class="w-full bg-white/5 border border-white/10 focus:border-cyan-500 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none"></textarea>
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="bg-rose-500/10 border border-rose-500/30 p-4">
                <p class="font-mono text-xs text-rose-400">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Success Message -->
            @if (successMessage()) {
              <div class="bg-emerald-500/10 border border-emerald-500/30 p-4">
                <p class="font-mono text-xs text-emerald-400">{{ successMessage() }}</p>
              </div>
            }

            <!-- Action Buttons -->
            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                [disabled]="isSubmitting()"
                class="flex-1 group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 transition-all overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] disabled:opacity-50 disabled:cursor-not-allowed">
                <div class="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-white/20"></div>
                <span class="relative font-mono text-xs text-black font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3">
                  @if (isSubmitting()) {
                    <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deploying...
                  } @else {
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    Deploy_Entrepot
                  }
                </span>
              </button>

              <button
                type="button"
                (click)="close()"
                [disabled]="isSubmitting()"
                class="flex-1 px-8 py-4 bg-white/5 border border-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span class="font-mono text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
                  Cancel
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class CreateEntrepotModalComponent {
  private entrepotService = inject(EntrepotService);

  isOpen = signal(false);
  isSubmitting = signal(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  entrepotCreated = output<EntrepotDto>();

  formData: EntrepotDto = {
    nom: '',
    adresse: '',
    capacite: undefined,
    description: ''
  };

  open(): void {
    this.isOpen.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  close(): void {
    this.isOpen.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.formData = {
      nom: '',
      adresse: '',
      capacite: undefined,
      description: ''
    };
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onSubmit(): void {
    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    console.log('🏭 Creating new entrepot:', this.formData);

    this.entrepotService.createEntrepot(this.formData).subscribe({
      next: (createdEntrepot) => {
        console.log('✅ Entrepot created successfully:', createdEntrepot);
        this.isSubmitting.set(false);
        this.successMessage.set('Entrepot deployed successfully!');

        // Emit the created entrepot
        this.entrepotCreated.emit(createdEntrepot);

        // Close modal after 1 second
        setTimeout(() => {
          this.close();
        }, 1000);
      },
      error: (error) => {
        console.error('❌ Error creating entrepot:', error);
        this.isSubmitting.set(false);

        let errorMsg = 'Failed to deploy entrepot. Please try again.';
        if (error.status === 400) {
          errorMsg = 'Invalid data. Please check all required fields.';
        } else if (error.status === 409) {
          errorMsg = 'Entrepot with this name already exists.';
        } else if (error.status === 0) {
          errorMsg = 'Cannot connect to server. Please check if backend is running.';
        }

        this.errorMessage.set(errorMsg);
      }
    });
  }
}
