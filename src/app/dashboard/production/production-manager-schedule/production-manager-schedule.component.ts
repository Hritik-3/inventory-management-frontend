// src/app/.../production-manager-schedule/production-manager-schedule.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

import {
  BackendSchedule,
  ProductDTO,
  ProductionScheduleRequest,
  ProductionScheduleResponse,
  ScheduleCreateResponse
} from '../../../models/production-schedule';
import { ProductionManagerScheduleService } from '../../../services/production-manager-schedule.service';

@Component({
  selector: 'app-production-manager-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './production-manager-schedule.component.html',
  styleUrls: ['./production-manager-schedule.component.css']
})
export class ProductionManagerScheduleComponent implements OnInit {

  scheduleForm!: FormGroup;
  schedules: ProductionScheduleResponse[] = [];
  lowStockProducts: ProductDTO[] = [];
  message: string = '';
  rawMaterialErrors: string[] = [];

  constructor(private fb: FormBuilder, private psService: ProductionManagerScheduleService) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      startDate: [null],
      endDate: [null]
    });

    this.fetchSchedules();
    this.fetchLowStockProducts();
  }

  // Fetch schedules
  fetchSchedules() {
    console.log('🔹 Fetching schedules...');
    this.psService.getAllSchedulesRaw().subscribe({
      next: (res: BackendSchedule[]) => {
        console.log('✅ Backend response:', res);
        this.schedules = res.map(s => ({
          scheduleId: s.psId,
          productId: s.productId,
          productName: s.productName,
          quantity: s.psQuantity,
          status: s.psStatus,
          currentStatus: s.psStatus,
          startDate: s.psStartDate,
          endDate: s.psEndDate,
          productionLineName: s.productionLineName || '-',
          message: s.actions
        }));
        console.log('Processed schedules:', this.schedules);
      },
      error: (err) => {
        console.error('❌ Error fetching schedules:', err);
        this.message = 'Error loading schedules: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Fetch low-stock products
  fetchLowStockProducts() {
    console.log('🔹 Fetching low-stock products...');
    this.psService.getLowStockProducts().subscribe({
      next: (res) => {
        console.log('✅ Low-stock products:', res);
        this.lowStockProducts = res;
      },
      error: (err) => {
        console.error('❌ Error fetching low-stock products:', err);
        this.message = 'Error loading low-stock products: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Create schedule manually
  createSchedule() {
    if (this.scheduleForm.invalid) return;

    const request: ProductionScheduleRequest = this.scheduleForm.value;
    console.log('Creating schedule:', request);

    this.psService.createSchedule(request).subscribe({
      next: (res: ScheduleCreateResponse) => {
        console.log('Create schedule response:', res);
        if ((res as any).allocatedSchedules) {
          this.message = res.message || '✅ Schedule created.';
          this.rawMaterialErrors = [];
          this.fetchSchedules();
        } else if ((res as any).success === false) {
          this.rawMaterialErrors = (res as any).insufficientList || [];
          this.message = '❌ Insufficient raw materials!';
        } else {
          this.message = res.message || '✅ Schedule created.';
        }
      },
      error: (err) => {
        console.error('❌ Error creating schedule:', err);
        this.message = '❌ Error creating schedule: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Complete schedule
  completeSchedule(schedule: ProductionScheduleResponse) {
    const performedBy = 'Manager';
    console.log('Completing schedule:', schedule.scheduleId);
    this.psService.completeSchedule(schedule.scheduleId, performedBy).subscribe({
      next: (msg) => {
        console.log('Complete schedule response:', msg);
        this.message = msg;
        this.fetchSchedules();
      },
      error: (err) => {
        console.error('❌ Error completing schedule:', err);
        this.message = '❌ Error: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Auto-schedule low-stock
  autoScheduleLowStock() {
    console.log('Auto-scheduling low-stock items...');
    this.psService.autoScheduleLowStock('System').subscribe({
      next: (msg) => {
        console.log('Auto-schedule response:', msg);
        this.message = msg;
        this.fetchSchedules();
        this.fetchLowStockProducts();
      },
      error: (err) => {
        console.error('❌ Auto-schedule failed:', err);
        this.message = '❌ Auto-schedule failed: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Download report (attempts to use filename from backend; falls back to default)
  downloadReport(format: 'pdf' | 'excel') {
    console.log('Downloading report in format:', format);

    // Prefer the response-with-headers method if available in service
    if (this.psService.downloadReportWithResponse) {
      this.psService.downloadReportWithResponse(format).subscribe({
        next: (resp: HttpResponse<Blob>) => {
          const blob = resp.body as Blob;
          const contentDisp = resp.headers.get('Content-Disposition') || resp.headers.get('content-disposition') || '';
          const filename = this.getFilenameFromContentDisposition(contentDisp)
            || `production_schedules.${format === 'pdf' ? 'pdf' : 'csv'}`;

          console.log('Saving file as:', filename);
          saveAs(blob, filename);
        },
        error: (err) => {
          // fallback to simple blob endpoint if advanced call fails
          console.error('❌ Error downloading report with headers:', err);
          this.downloadReportFallback(format);
        }
      });
    } else {
      // If service doesn't have the advanced method, use the simple one
      this.downloadReportFallback(format);
    }
  }

  // Fallback - simple blob download (existing behavior)
  private downloadReportFallback(format: 'pdf' | 'excel') {
    this.psService.downloadReport(format).subscribe({
      next: (blob: Blob) => {
        const filename = `production_schedules.${format === 'pdf' ? 'pdf' : 'csv'}`;
        saveAs(blob, filename);
      },
      error: (err) => {
        console.error('❌ Error downloading report (fallback):', err);
        this.message = '❌ Error downloading report: ' + (err.message || JSON.stringify(err));
      }
    });
  }

  // Extract filename from Content-Disposition header (supports filename* and quoted names)
  private getFilenameFromContentDisposition(contentDisposition: string | null): string | null {
    if (!contentDisposition) return null;

    // RFC5987 encoded filename: filename*=UTF-8''encoded-filename
    const filenameStarMatch = /filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i.exec(contentDisposition);
    if (filenameStarMatch && filenameStarMatch[1]) {
      try {
        return decodeURIComponent(filenameStarMatch[1].replace(/(^['"]|['"]$)/g, ''));
      } catch (e) {
        return filenameStarMatch[1].replace(/(^['"]|['"]$)/g, '');
      }
    }

    // Regular filename="..."
    const filenameMatch = /filename\s*=\s*"([^"]+)"/i.exec(contentDisposition);
    if (filenameMatch && filenameMatch[1]) {
      return filenameMatch[1];
    }

    // filename=without-quotes
    const filenameMatch2 = /filename\s*=\s*([^;]+)/i.exec(contentDisposition);
    if (filenameMatch2 && filenameMatch2[1]) {
      return filenameMatch2[1].trim();
    }

    return null;
  }
}
