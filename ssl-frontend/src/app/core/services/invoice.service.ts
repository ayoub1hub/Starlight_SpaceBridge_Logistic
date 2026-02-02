import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageResponse } from './order.service';

export interface Invoice {
  id?: string;
  invoiceNumber?: string;
  orderId: string;
  issueDate: Date;
  dueDate: Date;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}${environment.endpoints.invoices}`;

  getInvoices(page: number = 0, size: number = 10): Observable<PageResponse<Invoice>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Invoice>>(`${this.API_URL}`, { params });
  }

  getInvoiceById(id: string): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/${id}`);
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.API_URL}`, invoice);
  }

  updateInvoice(id: string, invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.API_URL}/${id}`, invoice);
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  markAsPaid(id: string, amount: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.API_URL}/${id}/pay`, { amount });
  }
}
