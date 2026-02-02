// src/app/core/services/entrepot.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EntrepotDto {
  id?: string;
  nom: string;
  adresse: string;
  capacite?: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EntrepotService {
  private http = inject(HttpClient);
  // Using direct URL since warehouses endpoint isn't in environment.endpoints
  private readonly API_URL = `${environment.apiUrl}/api/warehouses`;

  /**
   * Get all entrepots/warehouses
   */
  getAllEntrepots(): Observable<EntrepotDto[]> {
    console.log('🔗 Fetching all entrepots from:', this.API_URL);
    return this.http.get<EntrepotDto[]>(this.API_URL);
  }

  /**
   * Get entrepot by ID
   */
  getEntrepotById(id: string): Observable<EntrepotDto> {
    return this.http.get<EntrepotDto>(`${this.API_URL}/${id}`);
  }

  /**
   * Create new entrepot
   */
  createEntrepot(entrepot: EntrepotDto): Observable<EntrepotDto> {
    console.log('📦 Creating new entrepot:', entrepot);
    return this.http.post<EntrepotDto>(this.API_URL, entrepot);
  }

  /**
   * Update entrepot
   */
  updateEntrepot(id: string, entrepot: EntrepotDto): Observable<EntrepotDto> {
    return this.http.put<EntrepotDto>(`${this.API_URL}/${id}`, entrepot);
  }

  /**
   * Delete entrepot
   */
  deleteEntrepot(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}
