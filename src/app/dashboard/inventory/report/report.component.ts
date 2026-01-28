 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { saveAs } from 'file-saver';
import { BackButtonComponent } from '../../../back-button/back-button.component';
 
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './report.component.html'
})
export class ReportComponent {
 
  constructor(private reportService: ReportService) {}
 
  // ---------------- Stock Report ----------------
  downloadStock(type: string) {
    const filter = { categoryId: null, startDate: null, endDate: null };
    this.reportService.downloadStockReport(type, filter)
      .subscribe((blob: Blob) => {
        const fileName = type === 'csv' ? 'stock_report.csv' : 'stock_report.pdf';
        saveAs(blob, fileName);
      }, error => console.error('Download failed:', error));
  }
 
  // ---------------- Transaction Report ----------------
  downloadTransaction(type: string) {
    const filter = { categoryId: null, startDate: null, endDate: null };
    this.reportService.downloadTransactionReport(type, filter)
      .subscribe((blob: Blob) => {
        const fileName = type === 'csv' ? 'transaction_report.csv' : 'transaction_report.pdf';
        saveAs(blob, fileName);
      }, error => console.error('Download failed:', error));
  }
 
  // ---------------- Production Report ----------------
  downloadProduction(type: string) {
    const filter = { categoryId: null, startDate: null, endDate: null, status: null };
    this.reportService.downloadProductionReport(type, filter)
      .subscribe((blob: Blob) => {
        const fileName = type === 'csv' ? 'production_report.csv' : 'production_report.pdf';
        saveAs(blob, fileName);
      }, error => console.error('Download failed:', error));
  }
}
 