import { Component, OnInit } from '@angular/core';

import { AdminDashboardService } from '../../../services/admindashboardservice.service.spec';
import { CommonModule, DatePipe, NgFor, NgIf } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartData } from 'chart.js';
import { AdminDashboardResponse } from '../../../models/admindashboardresponse';

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, DatePipe, NgFor, NgIf, NgChartsModule],
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent implements OnInit {

  dashboardData!: AdminDashboardResponse;

  // Pie Chart properties
  pieChartData!: ChartData<'pie', number[], string | string[]>;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    }
  };

  constructor(private dashboardService: AdminDashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updatePieChart(); // Initialize chart data
      },
      error: (err) => console.error(err)
    });
  }

  // Convert backend roleStats into Chart.js pie chart format
  updatePieChart(): void {
  if (!this.dashboardData) return;

  this.pieChartData = {
    labels: this.dashboardData.roleStats.map(r => r.roleName),
    datasets: [
      {
        data: this.dashboardData.roleStats.map(r => r.count),

        // ✨ Gradient Colors (scriptable)
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: canvasCtx, chartArea } = chart;

          if (!chartArea) return; // Required when chart has not rendered

          const gradient = canvasCtx.createLinearGradient(
            chartArea.left,
            chartArea.top,
            chartArea.right,
            chartArea.bottom
          );

          // Add gradient stops (you can customize these)
          if (ctx.dataIndex === 0) {
            gradient.addColorStop(0, '#3b82f6'); // blue light
            gradient.addColorStop(1, '#1e40af'); // blue dark
          } else if (ctx.dataIndex === 1) {
            gradient.addColorStop(0, '#22c55e'); // green light
            gradient.addColorStop(1, '#166534'); // green dark
          } else if (ctx.dataIndex === 2) {
            gradient.addColorStop(0, '#fbbf24'); // yellow light
            gradient.addColorStop(1, '#b45309'); // yellow dark
          } else if (ctx.dataIndex === 3) {
            gradient.addColorStop(0, '#f87171'); // red light
            gradient.addColorStop(1, '#b91c1c'); // red dark
          } else {
            gradient.addColorStop(0, '#d8b4fe');
            gradient.addColorStop(1, '#9333ea');
          }

          return gradient;
        },

        hoverOffset: 8
      }
    ]
  };
}

}
