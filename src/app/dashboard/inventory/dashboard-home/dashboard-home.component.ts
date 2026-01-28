import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';

interface ProductDistribution {
  productName: string;
  quantity: number;
}

interface DashboardData {
  totalProducts: number;
  stockValue: number;
  lowStockAlerts: number;
  outOfStock: number;
  overstockItems: number;
  productDistribution: ProductDistribution[];
}

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
  dashboardData!: DashboardData;
  loading = true;

  // Doughnut chart
  doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#333', font: { size: 12 } }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const values = context.dataset.data as number[];
            const total = values.reduce((a, b) => a + b, 0);
            const value = context.parsed;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Bar chart
  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const category = context.label;
            let products: string[] = [];
            if (category === 'Low Stock') {
              products = this.dashboardData.productDistribution
                .filter(p => p.quantity <= 5) // low stock threshold
                .map(p => p.productName);
            } else if (category === 'Within Stock') {
              products = this.dashboardData.productDistribution
                .filter(p => p.quantity > 5 && p.quantity <= 20) // within stock range
                .map(p => p.productName);
            } else if (category === 'Overstock') {
              products = this.dashboardData.productDistribution
                .filter(p => p.quantity > 20) // overstock threshold
                .map(p => p.productName);
            }
            const count = context.parsed.y;
            return `${category}: ${count}\nProducts: ${products.join(', ')}`;
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#333' } },
      x: { ticks: { color: '#333' } }
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<DashboardData>('http://localhost:8086/api/dashboard').subscribe({
      next: (data) => {
        this.dashboardData = data;

        // Doughnut chart
        this.doughnutChartData = {
          labels: data.productDistribution.map(p => p.productName),
          datasets: [
            {
              data: data.productDistribution.map(p => p.quantity),
              backgroundColor: [
                '#4a90e2', '#50c878', '#f5a623', '#d0021b', '#9b59b6',
                '#16a085', '#f39c12', '#2c3e50', '#8e44ad', '#e67e22'
              ],
              borderWidth: 1
            }
          ]
        };

        // Bar chart
        this.barChartData = {
          labels: ['Low Stock', 'Within Stock', 'Overstock'],
          datasets: [
            {
              data: [
                data.productDistribution.filter(p => p.quantity <= 5).length,
                data.productDistribution.filter(p => p.quantity > 5 && p.quantity <= 20).length,
                data.productDistribution.filter(p => p.quantity > 20).length
              ],
              backgroundColor: ['#d0021b', '#4a90e2', '#50c878'],
              borderWidth: 1
            }
          ]
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.loading = false;
      }
    });
  }
}
