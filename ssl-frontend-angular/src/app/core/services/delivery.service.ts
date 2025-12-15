import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './order.service';

export interface Delivery {
  id?: string;
  deliveryNumber?: string;
  orderId: string;
  deliveryDate: Date;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  driverName?: string;
  vehicleNumber?: string;
  trackingNumber?: string;
  notes?: string;
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
    return this.http.get<PageResponse<Delivery>>(`${this.API_URL}`, { params });
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
