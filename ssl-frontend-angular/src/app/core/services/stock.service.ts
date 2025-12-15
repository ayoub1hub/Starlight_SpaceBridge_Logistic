import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './order.service';

export interface StockItem {
  id?: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  minimumQuantity: number;
  unit: string;
  location?: string;
  lastUpdated?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.endpoints.stock}`;

  getStockItems(page: number = 0, size: number = 10): Observable<PageResponse<StockItem>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<StockItem>>(`${this.API_URL}`, { params });
  }

  getStockById(id: string): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.API_URL}/${id}`);
  }

  updateStock(id: string, quantity: number): Observable<StockItem> {
    return this.http.patch<StockItem>(`${this.API_URL}/${id}`, { quantity });
  }

  getLowStockItems(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${this.API_URL}/low-stock`);
  }

  adjustStock(id: string, adjustment: number, reason: string): Observable<StockItem> {
    return this.http.post<StockItem>(`${this.API_URL}/${id}/adjust`, { adjustment, reason });
  }
}

