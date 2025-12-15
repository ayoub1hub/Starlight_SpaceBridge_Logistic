// src/app/core/services/auth.service.ts
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponse {
  token: string;
  type: string;
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // API URL - Update this based on your setup
  private apiUrl = 'http://localhost:8087/api/auth'; // Direct to auth-service
  // OR use API Gateway: 'http://localhost:8080/auth-service/api/auth'

  // Signals for reactive state management
  private currentUserSignal = signal<AuthResponse | null>(null);

  // Public computed signals - These return Signal objects
  currentUser = this.currentUserSignal.asReadonly();

  // ⭐ IMPORTANT: These are computed signals
  isAuthenticated = computed(() => {
    const user = this.currentUserSignal();
    if (!user) return false;

    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  });

  // ⭐ IMPORTANT: These are computed signals
  isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  isUser = computed(() => this.currentUserSignal()?.role === 'USER');

  constructor() {
    // Load user from localStorage on service initialization
    this.loadUserFromStorage();
  }

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  /**
   * Login user
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
      .pipe(
        tap(response => {
          this.handleAuthResponse(response);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Get authorization headers
   */
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Load user from localStorage
   */
  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSignal.set(user);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        this.logout();
      }
    }
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify(response));
    this.currentUserSignal.set(response);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() > expiry;
    } catch (e) {
      return true;
    }
  }
}
