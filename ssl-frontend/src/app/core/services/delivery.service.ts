import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './order.service';

export interface DriverDto {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  vehiclePlateNumber?: string;
  vehicleType?: string;
  licenseNumber?: string;
  rating?: number;
  status?: string;
  available?: boolean;
  personId?: string;
  currentLatitude?: number;
  currentLongitude?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Delivery {
  id?: string;
  deliveryNumber?: string;
  orderReference?: string;
  warehouseId?: string;
  customerName?: string;
  driver?: DriverDto;
  deliveryAddress?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'CANCELLED' | 'COMPLETED';
  priority?: string;
  scheduledDate?: string;
  scheduledAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  estimatedDistanceKm?: number;
  actualDistanceKm?: number;
  totalAmount?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: any[];
  proof?: any;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.endpoints.deliveries}`;

  getDeliveries(page: number = 0, size: number = 10): Observable<PageResponse<Delivery>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    // The backend returns a List<DeliveryDto> directly, not a PageResponse
    // So we need to transform it to match the expected PageResponse structure
    return this.http.get<Delivery[]>(`${this.API_URL}`, { params }).pipe(
      map((deliveries) => ({
        content: deliveries || [],
        totalElements: deliveries?.length || 0,
        totalPages: 1,
        size: size,
        number: page
      }))
    );
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.API_URL}/${id}`);
  }

  createDelivery(delivery: Delivery): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.API_URL}`, delivery);
  }

  updateDelivery(id: string, delivery: Delivery): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.API_URL}/${id}`, delivery);
  }

  updateDeliveryStatus(id: string, status: string): Observable<Delivery> {
    return this.http.patch<Delivery>(`${this.API_URL}/${id}/status`, { status });
  }

  trackDelivery(trackingNumber: string): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.API_URL}/track/${trackingNumber}`);
  }
}
