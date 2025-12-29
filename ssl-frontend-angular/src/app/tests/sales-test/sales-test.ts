import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SalesService } from '../../services/sales';
import { MatIconModule } from '@angular/material/icon';          // ← AJOUT
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-sales-test',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './sales-test.html',
  styleUrl: './sales-test.scss'
})
export class SalesTestComponent {
  ventes: any[] = [];
  loading = false;
  error: string | null = null;

  displayedColumns: string[] = ['id', 'numeroCommande', 'client', 'total', 'statut']; // adapte

  constructor(private salesService: SalesService) {}

  chargerVentes() {
    this.loading = true;
    this.error = null;
    this.salesService.getVentes().subscribe({
      next: (data) => {
        this.ventes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des ventes : ' + err.message;
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'primary';
      case 'COMPLETED': return 'accent';
      case 'CANCELLED': return 'warn';
      default: return 'warn';
    }
  }
}

export class SalesTest {
}
