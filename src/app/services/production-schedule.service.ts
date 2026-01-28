import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductionScheduleService {
  private baseUrl = 'http://localhost:8086/api/production'; // factory backend

  constructor(private http: HttpClient) {}

  // ✅ Create new production schedule (basic)
  createSchedule(productId: number, startDate: string, endDate: string, quantity: number): Observable<any> {
    const body = { productId, startDate, endDate, quantity };
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  // ✅ Auto-schedule all
  autoScheduleAll(createdBy: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auto-schedule-all`, { createdBy }, { responseType: 'text' });
  }

  // ✅ Complete all schedules
  completeAll(performedBy: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/complete-all?performedBy=${performedBy}`, {}, { responseType: 'text' });
  }

  // ✅ Get all schedules
  getAllSchedules(): Observable<any> {
    return this.http.get(`${this.baseUrl}/schedules`);
  }
}
