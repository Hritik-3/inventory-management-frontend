import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BackendSchedule,
  ProductDTO,
  ProductionScheduleRequest,
  ProductionScheduleResponse,
  ScheduleCreateResponse,
  ScheduleTracking,
  TimelineEvent,
  UnitLineStatus
} from '../models/production-schedule';

@Injectable({
  providedIn: 'root'
})
export class ProductionManagerScheduleService {
  // existing production API base
  private baseUrl = 'http://localhost:8086/api/production';

  // dedicated reports base (backend exposes /api/reports/... )
  private reportUrl = 'http://localhost:8086/api/reports';

  constructor(private http: HttpClient) {}

  // 🔹 Get all schedules (raw)
  getAllSchedulesRaw(): Observable<BackendSchedule[]> {
    const url = `${this.baseUrl}/schedules`;
    console.log('Calling backend URL:', url);
    return this.http.get<BackendSchedule[]>(url);
  }

  // 🔹 Get low stock products
  getLowStockProducts(): Observable<ProductDTO[]> {
    const url = `${this.baseUrl}/low-stock`;
    console.log('Calling backend URL for low stock:', url);
    return this.http.get<ProductDTO[]>(url);
  }

  // 🔹 Create schedule
  createSchedule(request: ProductionScheduleRequest): Observable<ScheduleCreateResponse> {
    const url = `${this.baseUrl}/create`;
    console.log('Creating schedule with URL:', url, 'Request:', request);
    return this.http.post<ScheduleCreateResponse>(url, request);
  }

  // 🔹 Complete schedule
  completeSchedule(scheduleId: number, performedBy: string): Observable<string> {
    const url = `${this.baseUrl}/complete/${scheduleId}?performedBy=${performedBy}`;
    console.log('Completing schedule with URL:', url);
    return this.http.post(url, {}, { responseType: 'text' });
  }

  // 🔹 Auto-schedule low stock
  autoScheduleLowStock(performedBy: string): Observable<string> {
    const url = `${this.baseUrl}/auto-schedule?performedBy=${performedBy}`;
    console.log('Auto-scheduling low stock URL:', url);
    return this.http.post(url, {}, { responseType: 'text' });
  }

  // 🔹 Track schedule
  trackSchedule(scheduleId: number): Observable<ScheduleTracking> {
    const url = `${this.baseUrl}/track-schedule/${scheduleId}`;
    console.log('Tracking schedule URL:', url);
    return this.http.get<ScheduleTracking>(url);
  }

  // 🔹 Get timeline
  getTimeline(scheduleId: number): Observable<TimelineEvent[]> {
    const url = `${this.baseUrl}/timeline/${scheduleId}`;
    console.log('Fetching timeline URL:', url);
    return this.http.get<TimelineEvent[]>(url);
  }

  // 🔹 Unit status
  getUnitsStatus(): Observable<UnitLineStatus[]> {
    const url = `${this.baseUrl}/units-status`;
    console.log('Fetching units status URL:', url);
    return this.http.get<UnitLineStatus[]>(url);
  }

  // ---------------- REPORT DOWNLOAD ----------------

  /**
   * Simple download: returns Blob for caller to save.
   * - format 'pdf' -> GET /api/reports/production-schedule/pdf
   * - format 'excel' -> GET /api/reports/production-schedule/csv
   */
  downloadReport(format: 'pdf' | 'excel'): Observable<Blob> {
    const endpoint =
      format === 'pdf'
        ? `${this.reportUrl}/production-schedule/pdf`
        : `${this.reportUrl}/production-schedule/csv`;

    console.log('Downloading report (blob) from:', endpoint);
    return this.http.get(endpoint, { responseType: 'blob' });
  }

  /**
   * Advanced download: returns full HttpResponse<Blob> so caller can read headers (e.g. Content-Disposition).
   * Use this when you want the server-provided filename.
   */
  downloadReportWithResponse(format: 'pdf' | 'excel'): Observable<HttpResponse<Blob>> {
    const endpoint =
      format === 'pdf'
        ? `${this.reportUrl}/production-schedule/pdf`
        : `${this.reportUrl}/production-schedule/csv`;

    console.log('Downloading report (response) from:', endpoint);
    // Type assertion is required because of responseType: 'blob' generic typing in HttpClient
    return this.http.get(endpoint, {
      observe: 'response',
      responseType: 'blob'
    }) as Observable<HttpResponse<Blob>>;
  }
}
