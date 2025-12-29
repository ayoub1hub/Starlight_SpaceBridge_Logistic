import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DeliveryService } from '../../services/delivery';

@Component({
  selector: 'app-delivery-test',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './delivery-test.html',
  styleUrl: './delivery-test.scss'
})
export class DeliveryTestComponent {
  livraisons: any[] = [];
  loading = false;
  error: string | null = null;

  displayedColumns: string[] = ['id', 'numeroSuivi', 'statut', 'dateLivraison']; // adapte

  constructor(private deliveryService: DeliveryService) {}

  chargerLivraisons() {
    this.loading = true;
    this.error = null;
    this.deliveryService.getLivraisons().subscribe({
      next: (data) => {
        this.livraisons = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des livraisons : ' + err.message;
        this.loading = false;
      }
    });
  }
}
