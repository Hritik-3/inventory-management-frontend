import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { PurchaseOrder } from '../models/return';

@Injectable({ providedIn: 'root' })
export class ReturnOrderService {
  private baseUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient) {}

  getReturnableOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getallorders`).pipe(
      map(data =>
        data.map(order => ({
          poId: order.poId,
          orderDate: order.orderDate,
          expectedDeliveryDate: order.expectedDeliveryDate,
          deliveryStatus: order.deliveryStatus,
          totalAmount: order.totalAmount,
          customerName: order.customer?.name || order.customerName || 'N/A',
          items: order.items.map((item: any) => ({
            purchaseOrderItemId: item.purchaseOrderItemId ?? item.itemId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            returnedQuantity: item.returnedQuantity ?? 0
          }))
        }))
      )
    );
  }

  submitReturn(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/return-orders`, payload);
  }
}
