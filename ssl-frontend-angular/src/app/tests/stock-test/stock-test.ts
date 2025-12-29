import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { StockService } from '../../services/stock';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-stock-test',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './stock-test.html',
  styleUrl: './stock-test.scss'
})
export class StockTest {
  entrepots: any[] = [];
  stocks: any[] = [];
  loading = false;
  error: string | null = null;

  displayedColumnsEntrepot: string[] = ['code', 'name', 'location', 'capacity'];
  displayedColumnsStock: string[] = ['produit', 'quantite', 'entrepot'];

  displayedColumns: string[] = ['id', 'code', 'nom']; // adapte selon tes champs réels

  constructor(
    private stockService: StockService,
    private cdr: ChangeDetectorRef  // ← INJECTION
  ) {}
  chargerEntrepots() {
    this.loading = true;
    this.error = null;
    this.stockService.getEntrepots().subscribe({
      next: (data) => {
        this.entrepots = data;
        this.loading = false;
        this.cdr.detectChanges();  // ← Force la revérification → plus d'erreur
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des entrepôts : ' + err.message;
        this.loading = false;
      }
    });
  }

  chargerStocks() {
    this.loading = true;
    this.error = null;
    this.stockService.getStocks().subscribe({
      next: (data) => {
        this.stocks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des stocks : ' + err.message;
        this.loading = false;
      }
    });
  }
}
