import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcurementDashboardDTO } from '../../../models/procurement-dashboard.dto';
import { ProcurementOfficerDashboardService } from '../../../services/procurement-officer-dashboard.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-procurement-officer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule   // ✅ Add this for pie charts
  ],
  templateUrl: './procurement-officer-dashboard.component.html',
  styleUrl: './procurement-officer-dashboard.component.css'
})
export class ProcurementOfficerDashboardComponent implements OnInit {

  dashboard!: ProcurementDashboardDTO;
  loading = true;

  // ✅ PIE CHART DATA
  orderPieData!: ChartData<'pie'>;
  orderChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(private dashboardService: ProcurementOfficerDashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.loading = false;

        // 📌 COUNT ORDERS
        const supplierCount = data.supplierOrders.length;
        const customerCount = data.customerOrders.length;

        // 📌 PIE CHART DATA
        this.orderPieData = {
          labels: ['Supplier Orders', 'Customer Orders'],
          datasets: [
            {
              data: [supplierCount, customerCount],
            }
          ]
        };
      },
      error: (err) => {
        console.error('Dashboard API Error', err);
        this.loading = false;
      }
    });
  }
}
