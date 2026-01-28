import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierRatingService {

  private baseUrl = 'http://localhost:8086/api/supplier-ratings';

  constructor(private http: HttpClient) {}

  // ➤ Add rating
  addRating(data: {
    supplierId: number;
    ratingValue: number;
    comments: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, data);
  }

  // ➤ Get all ratings for specific supplier
  getRatingsBySupplier(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/supplier/${supplierId}`);
  }

  // ➤ Get latest rating
  getLatestRating(supplierId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/supplier/${supplierId}/latest`);
  }
}
