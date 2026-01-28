import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LowStockAlert } from '../models/LowStockAlert';
 
@Injectable({
  providedIn: 'root'
})
export class LowStockAlertService {
 
  private baseUrl = 'http://localhost:8086/api/low-stock-alerts';
 
  constructor(private http: HttpClient) {}
 
  // Helper to include JWT token in headers
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    });
  }
 
  // Get all alerts (with JWT)
  getAlerts(): Observable<LowStockAlert[]> {
    return this.http.get<LowStockAlert[]>(this.baseUrl, {
      headers: this.getHeaders()
    });
  }
 
  // Acknowledge an alert (with JWT)
  acknowledgeAlert(id: number): Observable<LowStockAlert> {
    return this.http.post<LowStockAlert>(`${this.baseUrl}/acknowledge/${id}`, {}, {
      headers: this.getHeaders()
    });
  }
 
  // Trigger manual check
  triggerCheck(): Observable<any> {
    return this.http.post(`${this.baseUrl}/check`, {}, {
      headers: this.getHeaders()
    });
  }
}
 
 