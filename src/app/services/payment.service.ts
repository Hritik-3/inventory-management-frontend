// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class PaymentService {

//   constructor() { }
// }

// import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
export interface PaymentHistory {
  id: number;
  amount: number;
  order_id: number;
  payment_date: string;
  status: string;
}
 
@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = 'http://localhost:8086/api/payments';
 
  constructor(private http: HttpClient) {}
 
  // Process payment
  payOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders/${orderId}/pay`, {});
  }
 
  // Fetch payment history
  getPaymentHistory(): Observable<PaymentHistory[]> {
    return this.http.get<PaymentHistory[]>(`${this.baseUrl}/history`);
  }
}
 