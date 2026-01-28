import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
 
export interface ProductionOrder {
  scheduleId: number;
  productId: number;
  productName: string;
  quantity: number;
  startDate: string;
  endDate?: string;
  status: string;
  actions?: string;      // from backend
  actionTaken?: boolean;
}
 
@Injectable({
  providedIn: 'root'
})
export class ProductionTrackingService {
  private baseUrl = 'http://localhost:8086/api/production-tracking';
 
  constructor(private http: HttpClient) {}
 
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }
 
  getAllOrders(): Observable<ProductionOrder[]> {
    return this.http.get<ProductionOrder[]>(`${this.baseUrl}`, { headers: this.getAuthHeaders() });
  }
 
  getOrderById(id: number): Observable<ProductionOrder> {
    return this.http.get<ProductionOrder>(`${this.baseUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
 
  updateActions(id: number, action: string): Observable<string> {
  return this.http.put(
    `${this.baseUrl}/${id}/actions?action=${action}`,
    {},
    {
      headers: this.getAuthHeaders(),
      responseType: 'text' // 👈 tell Angular to expect text
    }
  ) as Observable<string>; // 👈 cast to Observable<string>
}
 
}
 
 