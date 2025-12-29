import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // Liste des livraisons
  getLivraisons(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/deliveries`);
  }
}
