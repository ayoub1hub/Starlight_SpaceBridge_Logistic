import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Warehouse {
  id?: string;
  code: string;
  nom: string;
  adresse?: string;
}

export interface Stock {
  id?: string;
  produitId: string;
  quantite: number;
  entrepotId: string;
}

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  getEntrepots(): Observable<Warehouse[]> {
    return this.http.get<Warehouse[]>(`${this.baseUrl}/warehouses`);
  }

  getStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/stocks`);
  }
}
