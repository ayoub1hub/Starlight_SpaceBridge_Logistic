import { Component } from '@angular/core';
import { StockTest } from './stock-test/stock-test';
import { DeliveryTestComponent } from './delivery-test/delivery-test';
import { SalesTestComponent } from './sales-test/sales-test';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [
    StockTest,
    DeliveryTestComponent,
    SalesTestComponent,
    MatButtonModule,
    MatTabsModule,
    RouterLink
  ],
  templateUrl: './tests.html',
  styleUrl: './tests.scss'
})
export class TestsComponent {}
