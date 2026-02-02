import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryService, Delivery } from '../../core/services/delivery.service';

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 bg-slate-50 min-h-screen">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Logistics Tracking</h1>
        <p class="text-slate-500 mt-1">Real-time status of inter-connected supply chains.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        @for (delivery of deliveries(); track delivery.id) {
          <div class="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all relative overflow-hidden group">
            <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg class="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M10 17l5-5-5-5v10z"/></svg>
            </div>

            <div class="flex justify-between items-start mb-6">
              <div>
                <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">
                  Active Mission
                </span>
                <h3 class="text-xl font-extrabold text-slate-900">{{ delivery.deliveryNumber }}</h3>
                <p class="text-xs text-slate-400 font-mono">Order Ref: {{ delivery.orderId }}</p>
              </div>
              <span [ngClass]="getStatusClass(delivery.status)" class="px-4 py-1.5 rounded-xl text-xs font-bold uppercase">
                {{ delivery.status }}
              </span>
            </div>

            <div class="space-y-4">
              <div class="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div class="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-width="2"/></svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-400 uppercase">Logistics Officer</p>
                  <p class="text-sm font-bold text-slate-700">{{ delivery.driverName || 'Automated Unit' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="p-4 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Vehicle Unit</p>
                   <p class="text-sm font-bold text-slate-700">{{ delivery.vehicleNumber || 'N/A' }}</p>
                </div>
                <div class="p-4 rounded-2xl border border-slate-100">
                   <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">Target Date</p>
                   <p class="text-sm font-bold text-slate-700">{{ delivery.deliveryDate | date:'shortDate' }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
              <div class="flex flex-col">
                <span class="text-[10px] font-bold text-slate-400 uppercase">Tracking Link</span>
                <span class="text-xs font-mono text-indigo-500">{{ delivery.trackingNumber || 'PENDING_GEN' }}</span>
              </div>
              <button class="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors">
                View Full Logs
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class DeliveriesComponent implements OnInit {
  private deliveryService = inject(DeliveryService);
  deliveries = signal<Delivery[]>([]);

  ngOnInit() {
    this.deliveryService.getDeliveries().subscribe(res => this.deliveries.set(res.content));
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'DELIVERED': return 'bg-emerald-500 text-white';
      case 'IN_TRANSIT': return 'bg-blue-500 text-white';
      case 'SCHEDULED': return 'bg-amber-500 text-white';
      case 'FAILED': return 'bg-rose-500 text-white';
      default: return 'bg-slate-200 text-slate-600';
    }
  }
}
