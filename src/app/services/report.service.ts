 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = 'http://localhost:8086/api/reports/export';  // backend URL
 
  constructor(private http: HttpClient) {}
 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // replace with your JWT storage key
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
 
  downloadStockReport(exportType: string, filter: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/stock?exportType=${exportType}`, filter, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
 
  downloadTransactionReport(exportType: string, filter: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/transactions?exportType=${exportType}`, filter, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
 
  downloadProductionReport(exportType: string, filter: any): Observable<Blob> {
    return this.http.post(`${this.baseUrl}/production?exportType=${exportType}`, filter, {
      responseType: 'blob',
      headers: this.getAuthHeaders()
    });
  }
}
 
 