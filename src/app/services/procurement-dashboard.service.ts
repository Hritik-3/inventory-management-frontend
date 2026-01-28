import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO for totals
export interface ProcurementOverview {
  totalPurchasedItems: number;
  totalReturnedItems: number;
  returnPercentage: number;
}

export interface ProcurementStats {
  totalPurchased: number;
  totalReturned: number;
  returnPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProcurementDashboardService {
  private apiUrl = 'http://localhost:8086/api/procurement-dashboard';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<ProcurementOverview> {
    return this.http.get<ProcurementOverview>(`${this.apiUrl}/overview`);
  }

  getStats(): Observable<ProcurementStats> {
    return this.http.get<ProcurementStats>(`${this.apiUrl}/stats`);
  }
}
