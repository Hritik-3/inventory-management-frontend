import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ProcurementDashboardService, ProcurementOverview, ProcurementStats } from '../../../services/procurement-dashboard.service';

@Component({
  selector: 'app-procurement-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './procurement-dashboard.component.html',
  styleUrls: ['./procurement-dashboard.component.css']
})
export class ProcurementDashboardComponent implements OnInit {
  overview?: ProcurementOverview;
  stats?: ProcurementStats;

  barChartData?: ChartData<'bar'>;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const datasetLabel = context.dataset.label || '';
            const value = context.raw as number;
            let percentage = '';
            if (this.stats && datasetLabel === 'Returned Items') {
              percentage = ` (Return %: ${this.stats.returnPercentage.toFixed(2)}%)`;
            }
            return `${datasetLabel}: ${value}${percentage}`;
          }
        }
      }
    }
  };

  constructor(private dashboardService: ProcurementDashboardService) {}

  ngOnInit(): void {
    // Fetch overview
    this.dashboardService.getOverview().subscribe(data => {
      this.overview = data;
    });

    // Fetch stats (totals)
    this.dashboardService.getStats().subscribe(data => {
      this.stats = data;
      this.prepareBarChart();
    });
  }

  private prepareBarChart(): void {
    if (!this.stats) return;

    // Use totals directly
    const purchased = this.stats.totalPurchased || 0;
    const returned = this.stats.totalReturned || 0;

    this.barChartData = {
      labels: ['Total'],
      datasets: [
        { label: 'Purchased Items', data: [purchased], backgroundColor: 'rgba(54, 162, 235, 0.7)' },
        { label: 'Returned Items', data: [returned], backgroundColor: 'rgba(255, 99, 132, 0.7)' }
      ]
    };
  }
}
