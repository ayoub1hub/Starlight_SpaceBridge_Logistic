import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { DeliveryService, Delivery } from '../../core/services/delivery.service';
import { ProductService, Product } from '../../core/services/product.service';

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  vehicleNumber?: string;
  currentLocation?: string;
}

@Component({
  selector: 'app-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <!-- Header Section -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Delivery Tracking</h1>
          <p class="text-slate-600 mt-1">Real-time monitoring of all deliveries and driver assignments</p>
        </div>
        <button
          (click)="showAddDeliveryModal.set(true)"
          class="btn-primary">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add Delivery
          </span>
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="glass-morphism rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-slate-900">{{ deliveries().length || 0 }}</p>
              <p class="text-xs text-slate-500 font-medium">Total Deliveries</p>
            </div>
          </div>
        </div>
        
        <div class="glass-morphism rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-emerald-500 to-green-500 p-3 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-emerald-600">{{ getDeliveredCount() }}</p>
              <p class="text-xs text-slate-500 font-medium">Delivered</p>
            </div>
          </div>
        </div>

        <div class="glass-morphism rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-blue-600">{{ getInTransitCount() }}</p>
              <p class="text-xs text-slate-500 font-medium">In Transit</p>
            </div>
          </div>
        </div>

        <div class="glass-morphism rounded-2xl p-6 border border-slate-200">
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-2xl font-black text-amber-600">{{ getScheduledCount() }}</p>
              <p class="text-xs text-slate-500 font-medium">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="glass-morphism rounded-3xl border border-slate-200 p-12 flex items-center justify-center">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p class="text-slate-500">Loading deliveries...</p>
          </div>
        </div>
      } @else {
        <!-- Deliveries Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          @for (delivery of deliveries() || []; track delivery.id) {
            <div class="glass-morphism rounded-3xl border border-slate-200 shadow-xl overflow-hidden card-hover">
              <!-- Header -->
              <div class="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <span class="text-[10px] font-black text-indigo-600 uppercase tracking-wider bg-indigo-100 px-2 py-1 rounded-md mb-2 inline-block">
                      Delivery #{{ delivery.id?.slice(0, 8) || 'NEW' }}
                    </span>
                    <h3 class="text-xl font-black text-slate-900">{{ delivery.deliveryNumber || 'New Delivery' }}</h3>
                    <p class="text-xs text-slate-500 font-mono">Order: {{ delivery.orderReference }}</p>
                  </div>
                  <span [ngClass]="getStatusClass(delivery.status)" class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border">
                    {{ delivery.status.replace('_', ' ') }}
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-6 space-y-4">
                <!-- Driver Information -->
                <div class="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200">
                  <div class="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-xl text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-[10px] font-black text-blue-600 uppercase tracking-wider">Assigned Driver</p>
                    <p class="text-sm font-black text-slate-900">{{ delivery.driver?.name || 'Unassigned' }}</p>
                    @if (delivery.driver?.vehiclePlateNumber) {
                      <p class="text-xs text-slate-500">Vehicle: {{ delivery.driver?.vehiclePlateNumber }}</p>
                    }
                    @if (delivery.driver?.phone) {
                      <p class="text-xs text-slate-500">Phone: {{ delivery.driver?.phone }}</p>
                    }
                  </div>
                </div>

                <!-- Delivery Details -->
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p class="text-[10px] font-black text-slate-600 uppercase">Scheduled Date</p>
                    <p class="text-sm font-bold text-slate-900">{{ delivery.scheduledDate || 'Not set' }}</p>
                  </div>
                  <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p class="text-[10px] font-black text-slate-600 uppercase">Customer</p>
                    <p class="text-sm font-bold text-slate-900">{{ delivery.customerName || 'N/A' }}</p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-4 border-t border-slate-100">
                  <button (click)="trackDelivery(delivery)" 
                          class="flex-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:from-indigo-100 hover:to-blue-100 transition-all border border-indigo-200">
                    <span class="flex items-center justify-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      Track Live
                    </span>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Empty State -->
        @if ((deliveries() || []).length === 0) {
          <div class="glass-morphism rounded-3xl border border-slate-200 p-16 text-center">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-200">
              <svg class="w-20 h-20 mx-auto text-slate-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
              <h3 class="text-2xl font-bold text-slate-700 mb-3">No Deliveries Found</h3>
              <p class="text-slate-500 mb-6">Start by adding your first delivery to begin tracking</p>
              <button
                (click)="showAddDeliveryModal.set(true)"
                class="btn-primary w-full">
                Add First Delivery
              </button>
            </div>
          </div>
        }
      }
    </div>

    <!-- Add Delivery Modal -->
    @if (showAddDeliveryModal()) {
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" (click)="onModalBackdropClick($event)">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden" (click)="$event.stopPropagation()">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">Add New Delivery</h2>
            <button (click)="showAddDeliveryModal.set(false)" class="text-white hover:text-white/80 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <form [formGroup]="deliveryForm" class="space-y-5">
              <!-- Order Reference -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Order Reference *</label>
                <input type="text" formControlName="orderReference" placeholder="Enter order reference" 
                       class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              </div>

              <!-- Delivery Number -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Delivery Number</label>
                <input type="text" formControlName="deliveryNumber" placeholder="Enter delivery number" 
                       class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              </div>

              <!-- Customer Name -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Customer Name *</label>
                <input type="text" formControlName="customerName" placeholder="Enter customer name" 
                       class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              </div>

              <!-- Scheduled Date -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Scheduled Date *</label>
                <input type="date" formControlName="scheduledDate" 
                       class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              </div>

              <!-- Status -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Status *</label>
                <select formControlName="status" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed (Sale)</option>
                  <option value="FAILED">Failed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <!-- Total Amount -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Total Amount ($)</label>
                <input type="number" formControlName="totalAmount" placeholder="0.00" step="0.01"
                       class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
              </div>

              <!-- Priority -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                <select formControlName="priority" class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  <option value="Normal">Normal</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <!-- Notes -->
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                <textarea formControlName="notes" rows="3" placeholder="Enter delivery notes" 
                          class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"></textarea>
              </div>

              <!-- Products Section -->
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-bold text-slate-700">Products</label>
                  <button type="button" (click)="addProduct()" 
                          class="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium hover:bg-indigo-100 transition-all border border-indigo-200">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                      </svg>
                      Add Product
                    </span>
                  </button>
                </div>

                @if (isLoadingProducts()) {
                  <div class="text-center py-4">
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <p class="text-xs text-slate-500 mt-2">Loading products...</p>
                  </div>
                } @else {
                  <div formArrayName="products" class="space-y-3">
                    @for (product of productFormArray.controls; track $index; let i = $index) {
                      <div [formGroupName]="i" class="flex gap-3 items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div class="flex-1">
                          <select formControlName="productId" class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option value="">Select Product</option>
                            @for (item of getAvailableProducts(); track item.id) {
                              <option [value]="item.id">{{ item.name || item.nom }} ({{ item.unite }})</option>
                            }
                          </select>
                        </div>
                        <div class="w-24">
                          <input type="number" formControlName="quantity" min="1" 
                                 class="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                 placeholder="Qty">
                        </div>
                        <button type="button" (click)="removeProduct(i)" 
                                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    }
                    
                    @if (productFormArray.length === 0) {
                      <div class="text-center py-6 text-slate-500">
                        <svg class="w-12 h-12 mx-auto text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-sm">No products added yet</p>
                        <p class="text-xs">Click "Add Product" to include items in this delivery</p>
                      </div>
                    }
                  </div>
                }
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-200">
            <button type="button" (click)="showAddDeliveryModal.set(false)" 
                    class="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-100 transition-all">
              Cancel
            </button>
            <button type="button" (click)="onAddDelivery()" 
                    [disabled]="deliveryForm.invalid || isSubmitting()"
                    class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              @if (isSubmitting()) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              } @else {
                Create Delivery
              }
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class DeliveriesComponent implements OnInit {
  private deliveryService = inject(DeliveryService);
  private productService = inject(ProductService);
  private fb = inject(FormBuilder);
  deliveries = signal<Delivery[]>([]);
  isLoading = signal(false);
  showAddDeliveryModal = signal(false);
  isSubmitting = signal(false);
  
  // Product management
  products = signal<Product[]>([]);
  isLoadingProducts = signal(false);

  // Tracking management
  showTrackingModal = signal(false);
  selectedDelivery = signal<Delivery | null>(null);

  deliveryForm!: FormGroup;

  ngOnInit() {
    this.loadDeliveries();
    this.loadProducts();
    this.initForm();
  }

  initForm() {
    this.deliveryForm = this.fb.group({
      orderReference: ['', Validators.required],
      deliveryNumber: [''],
      customerName: ['', Validators.required],
      scheduledDate: ['', Validators.required],
      status: ['SCHEDULED', Validators.required],
      totalAmount: [0],
      priority: ['Normal'],
      notes: [''],
      products: this.fb.array([])
    });
  }

  loadDeliveries() {
    this.isLoading.set(true);
    console.log('🔗 Loading deliveries from API...');
    
    this.deliveryService.getDeliveries().subscribe({
      next: (response) => {
        console.log('✅ API Response received:', response);
        console.log('📦 Response content:', response.content);
        console.log('📊 Response structure:', {
          hasContent: !!response.content,
          contentLength: response.content?.length || 0,
          totalElements: response.totalElements,
          totalPages: response.totalPages
        });
        
        this.deliveries.set(response.content || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('❌ Error loading deliveries:', error);
        console.error('📍 Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url
        });
        this.isLoading.set(false);
      }
    });
  }

  loadProducts() {
    this.isLoadingProducts.set(true);
    
    this.productService.getAllProducts().subscribe({
      next: (response: Product[]) => {
        this.products.set(response || []);
        this.isLoadingProducts.set(false);
      },
      error: (error: any) => {
        this.isLoadingProducts.set(false);
      }
    });
  }

  // Form array getters
  get productFormArray() {
    return this.deliveryForm.get('products') as FormArray;
  }

  // Product management methods
  addProduct() {
    const productGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    this.productFormArray.push(productGroup);
  }

  removeProduct(index: number) {
    this.productFormArray.removeAt(index);
  }

  getAvailableProducts(): Product[] {
    return this.products();
  }

  getProductById(productId: string): Product | undefined {
    return this.products().find(item => item.id === productId);
  }

  onAddDelivery() {
    if (this.deliveryForm.invalid) return;

    this.isSubmitting.set(true);
    const formValue = this.deliveryForm.value;

    const deliveryData = {
      orderReference: formValue.orderReference,
      deliveryNumber: formValue.deliveryNumber,
      customerName: formValue.customerName,
      scheduledDate: formValue.scheduledDate,
      status: formValue.status,
      totalAmount: formValue.totalAmount,
      priority: formValue.priority,
      notes: formValue.notes
    };

    this.deliveryService.createDelivery(deliveryData).subscribe({
      next: (response) => {
        this.showAddDeliveryModal.set(false);
        this.isSubmitting.set(false);
        this.loadDeliveries();
        this.deliveryForm.reset();
      },
      error: (error) => {
        console.error('Error creating delivery:', error);
        this.isSubmitting.set(false);
      }
    });
  }

  onModalBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.showAddDeliveryModal.set(false);
    }
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'DELIVERED': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200';
      case 'COMPLETED': return 'bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200';
      case 'IN_TRANSIT': return 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200';
      case 'SCHEDULED': return 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200';
      case 'FAILED': return 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200';
      default: return 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200';
    }
  }

  getDeliveredCount(): number {
    return (this.deliveries() || []).filter(d => d.status === 'DELIVERED' || d.status === 'COMPLETED').length;
  }

  getInTransitCount(): number {
    return (this.deliveries() || []).filter(d => d.status === 'IN_TRANSIT').length;
  }

  getScheduledCount(): number {
    return (this.deliveries() || []).filter(d => d.status === 'SCHEDULED').length;
  }

  getCompletedSalesCount(): number {
    return (this.deliveries() || []).filter(d => d.status === 'COMPLETED').length;
  }

  getTotalSalesAmount(): number {
    return (this.deliveries() || [])
      .filter(d => d.status === 'COMPLETED')
      .reduce((total, delivery) => total + (delivery.totalAmount || 0), 0);
  }

  // Tracking methods
  trackDelivery(delivery: Delivery) {
    this.selectedDelivery.set(delivery);
    this.showTrackingModal.set(true);
  }

  closeTrackingModal() {
    this.showTrackingModal.set(false);
    this.selectedDelivery.set(null);
  }

  getEstimatedTimeOfArrival(delivery: Delivery): string {
    // Simple ETA calculation - can be enhanced with real-time data
    if (delivery.status === 'DELIVERED' || delivery.status === 'COMPLETED') {
      return 'Delivered';
    }
    
    const scheduledDate = delivery.scheduledDate ? new Date(delivery.scheduledDate) : new Date();
    const now = new Date();
    const diffHours = Math.ceil((scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) return 'Expected soon';
    if (diffHours <= 1) return 'Within 1 hour';
    if (diffHours <= 24) return `Within ${diffHours} hours`;
    return `${Math.ceil(diffHours / 24)} days`;
  }

  getTrackingStatusColor(status: string): string {
    switch (status) {
      case 'SCHEDULED': return 'text-amber-600 bg-amber-50';
      case 'IN_TRANSIT': return 'text-blue-600 bg-blue-50';
      case 'DELIVERED': return 'text-emerald-600 bg-emerald-50';
      case 'COMPLETED': return 'text-purple-600 bg-purple-50';
      case 'FAILED': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  }
}
