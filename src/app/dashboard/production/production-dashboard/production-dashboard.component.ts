import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-production-manager-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './production-dashboard.component.html',
  styleUrls: ['./production-dashboard.component.css']
})
export class ProductionDashboardComponent implements OnInit {

  products: any[] = [];
  rawMaterials: any[] = [];
  productionLines: any[] = [];

  productRawMaterials: { [key: number]: any[] } = {};
  productCharts: { [key: number]: ChartData<'pie', number[], string> } = {};

  chartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    }
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any>("http://localhost:8086/api/production-manager/dashboard")
      .subscribe(res => {
        this.products = res.products;
        this.rawMaterials = res.rawMaterials;
        this.productionLines = res.productionLines;

        // Group raw materials by product
        this.productRawMaterials = res.productRawMaterials.reduce((acc: any, curr: any) => {
          if (!acc[curr.productId]) acc[curr.productId] = [];
          acc[curr.productId].push(curr);
          return acc;
        }, {});

        // Build stable chart data (prevents flickering)
        this.buildCharts();
      });
  }

  // Retrieve raw material name
  getRawMaterialName(id: number): string {
    const rm = this.rawMaterials.find(r => r.rwId === id);
    return rm ? rm.rwName : 'Unknown';
  }

  // Pre-generate all chart data ONCE
  buildCharts() {
    Object.keys(this.productRawMaterials).forEach(key => {
      const productId = Number(key);
      const usage = this.productRawMaterials[productId];

      this.productCharts[productId] = {
        labels: usage.map(u => this.getRawMaterialName(u.rawMaterialId)),
        datasets: [{
          data: usage.map(u => u.quantityRequiredPerUnit),
          backgroundColor: this.generateColors(usage.length)
        }]
      };
    });
  }

  // Fixed color generator (called ONCE)
  generateColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
    }
    return colors;
  }
}
