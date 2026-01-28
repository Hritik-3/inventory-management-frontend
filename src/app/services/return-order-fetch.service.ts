import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReturnOrderFetch } from '../models/return-order-fetch.model';

@Injectable({
  providedIn: 'root'
})
export class ReturnOrderFetchService {
  private baseUrl = 'http://localhost:8086/api/return-orders/fetch';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all return orders with their items
   */
  getAllReturnOrders(): Observable<ReturnOrderFetch[]> {
    return this.http.get<ReturnOrderFetch[]>(this.baseUrl);
  }

  /**
   * Fetch single return order by id
   */
  getReturnOrderById(id: number): Observable<ReturnOrderFetch> {
    return this.http.get<ReturnOrderFetch>(`${this.baseUrl}/${id}`);
  }
}
