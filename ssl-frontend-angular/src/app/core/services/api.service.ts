import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Constructs the full URL for an endpoint using the base API Gateway URL.
   * @param endpoint The specific resource path (e.g., 'orders', 'stock/alerts')
   */
  private getUrl(endpoint: string): string {
    return `${this.baseApiUrl}/${endpoint}`;
  }

  // --- Generic HTTP Methods ---

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(this.getUrl(endpoint), { params });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getUrl(endpoint), body);
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.getUrl(endpoint), body);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(endpoint));
  }
}
