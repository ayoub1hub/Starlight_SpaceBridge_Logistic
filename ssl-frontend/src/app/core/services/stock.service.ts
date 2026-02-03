// src/app/core/services/stock.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

// PageResponse interface - shared across services
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Backend DTO structure (what we receive from API)
interface BackendStockDto {
  id: string;
  entrepotId: string;
  produitId: string;
  entrepot?: {
    id: string;
    nom: string;
    adresse: string;
  };
  produit?: {
    id: string;
    nom: string;
    sku: string;
    unite: string;
    prix: number;
  };
  quantityAvailable: number;
  quantityReserved: number;
  minimumStockLevel: number;
  reorderLevel: number;
  lastRestockedAt?: string;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Backend Page structure for paginated response
interface BackendPageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// Frontend interface (what we use in components)
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
  entrepotId?: string;
}

export interface StockMetrics {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  criticalStockCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.endpoints.stock}`;

  /**
   * Transform backend DTO to frontend StockItem interface
   */
  private transformToStockItem(dto: BackendStockDto): StockItem {
    return {
      id: dto.id,
      productId: dto.produitId,
      productName: dto.produit?.nom || 'Unknown Product',
      sku: dto.produit?.sku || 'N/A',
      quantity: dto.quantityAvailable || 0,
      minimumQuantity: dto.minimumStockLevel || 0,
      unit: dto.produit?.unite || 'pcs',
      location: dto.entrepot?.nom || 'Unassigned',
      lastUpdated: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
      entrepotId: dto.entrepotId
    };
  }

  /**
   * Transform frontend StockItem to backend DTO for create/update
   */
  private transformToBackendDto(item: StockItem): Partial<BackendStockDto> {
    return {
      produitId: item.productId,
      entrepotId: item.entrepotId,
      quantityAvailable: item.quantity,
      minimumStockLevel: item.minimumQuantity
    };
  }

  /**
   * Get paginated stock items with optional entrepot filter
   */
    getStockItems(page: number = 0, size: number = 10, entrepotId?: string): Observable<PageResponse<StockItem>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (entrepotId && entrepotId.trim() !== '') {
      params = params.set('entrepotId', entrepotId);
    }

    return this.http.get<BackendPageResponse<BackendStockDto>>(`${this.API_URL}`, { params }).pipe(
      map(response => ({
        content: response.content.map(dto => this.transformToStockItem(dto)),
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number
      }))
    );
  }

  /**
   * Get stock item by ID
   */
  getStockById(id: string): Observable<StockItem> {
    return this.http.get<BackendStockDto>(`${this.API_URL}/${id}`).pipe(
      map(dto => this.transformToStockItem(dto))
    );
  }

  /**
   * Create new stock item
   */
  createStockItem(item: StockItem): Observable<StockItem> {
    const dto = this.transformToBackendDto(item);
    console.log('📝 Creating stock item:', dto);

    return this.http.post<BackendStockDto>(`${this.API_URL}`, dto).pipe(
      map(responseDto => {
        console.log('✅ Stock created:', responseDto);
        return this.transformToStockItem(responseDto);
      })
    );
  }

  /**
   * Update existing stock item
   */
  updateStockItem(id: string, item: StockItem): Observable<StockItem> {
    const dto = this.transformToBackendDto(item);
    console.log('📝 Updating stock item:', id, dto);

    return this.http.put<BackendStockDto>(`${this.API_URL}/${id}`, dto).pipe(
      map(responseDto => {
        console.log('✅ Stock updated:', responseDto);
        return this.transformToStockItem(responseDto);
      })
    );
  }

  /**
   * Update stock quantity (partial update)
   */
  updateStock(id: string, quantity: number): Observable<StockItem> {
    return this.http.patch<BackendStockDto>(`${this.API_URL}/${id}`, { quantityAvailable: quantity }).pipe(
      map(dto => this.transformToStockItem(dto))
    );
  }

  /**
   * Delete stock item
   */
  deleteStockItem(id: string): Observable<void> {
    console.log('🗑️ Deleting stock item:', id);
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Get low stock items with optional entrepot filter
   */
  getLowStockItems(entrepotId?: number): Observable<StockItem[]> {
    let params = new HttpParams();
    if (entrepotId !== undefined && entrepotId !== null) {
      params = params.set('entrepotId', entrepotId.toString());
    }

    return this.http.get<BackendStockDto[]>(`${this.API_URL}/low-stock`, { params }).pipe(
      map(dtos => dtos.map(dto => this.transformToStockItem(dto)))
    );
  }

  /**
   * Adjust stock with reason tracking
   */
  adjustStock(id: string, adjustment: number, reason: string): Observable<StockItem> {
    return this.http.post<BackendStockDto>(`${this.API_URL}/${id}/adjust`, { adjustment, reason }).pipe(
      map(dto => this.transformToStockItem(dto))
    );
  }

  /**
   * Get stock metrics for dashboard
   */
  getStockMetrics(entrepotId?: string | null): Observable<StockMetrics> {
    let params = new HttpParams();

    if (entrepotId && entrepotId.trim() !== '') {
      params = params.set('entrepotId', entrepotId.trim());
      console.log('📊 Fetching metrics for entrepot:', entrepotId);
    } else {
      console.log('📊 Fetching metrics for all entrepots');
    }

    const url = `${this.API_URL}/metrics`;
    console.log('🔗 Full metrics URL:', params.toString() ? `${url}?${params.toString()}` : url);

    return this.http.get<StockMetrics>(url, { params });
  }

  /**
   * Get all stock items (no pagination) - useful for dashboard calculations
   */
  getAllStockItems(entrepotId?: number): Observable<StockItem[]> {
    let params = new HttpParams();
    if (entrepotId !== undefined && entrepotId !== null) {
      params = params.set('entrepotId', entrepotId.toString());
    }
    return this.http.get<BackendStockDto[]>(`${this.API_URL}/all`, { params }).pipe(
      map(dtos => dtos.map(dto => this.transformToStockItem(dto)))
    );
  }

  /**
   * Export stock data to CSV
   */
  exportStockToCSV(entrepotId?: string): Observable<Blob> {
    let params = new HttpParams();

    // Handle entrepotId - could be string UUID or number
    if (entrepotId !== undefined && entrepotId !== null && entrepotId.trim() !== '') {
      params = params.set('entrepotId', entrepotId.trim());
      console.log('📊 Exporting CSV for entrepot:', entrepotId);
    } else {
      console.log('📊 Exporting CSV for all entrepots');
    }

    console.log('🔗 Export URL:', `${this.API_URL}/export/csv?${params.toString()}`);

    return this.http.get(`${this.API_URL}/export/csv`, {
      params,
      responseType: 'blob'
    });
  }
}
