import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface PurchaseOrderItem {
  poiId: number;
  poiQuantity: number;
  poiCost: number;
  productName?: string;
  productId?: number;
}

interface PurchaseOrder {
  poId: number;
  poOrderDate: string;
  poExpectedDelivery_date: string;
  poOrderType: string;
  poDeliveryStatus: string;
  supplierName?: string;
  customerName?: string;
  items: PurchaseOrderItem[];
}

@Component({
  selector: 'app-procurement-order-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './procurement-order-requests.component.html',
  styleUrls: ['./procurement-order-requests.component.css']
})
export class ProcurementOrderRequestsComponent implements OnInit {

  orders: PurchaseOrder[] = [];
  baseUrl = 'http://localhost:8086/api/purchase-orders/all';
  loading = false;
  errorMessage = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  /** ✅ Fetch all orders (supplier + customer) */
  fetchOrders(): void {
    this.loading = true;
    this.http.get<PurchaseOrder[]>(this.baseUrl).subscribe({
      next: data => {
        // ✅ Include both SUPPLIER_ORDER and CUSTOMER_ORDER
        this.orders = data.filter(o =>
          o.poOrderType === 'SUPPLIER_ORDER' || o.poOrderType === 'CUSTOMER_ORDER'
        );

        // Optional: sort by most recent
        this.orders.sort((a, b) => 
          new Date(b.poOrderDate).getTime() - new Date(a.poOrderDate).getTime()
        );

        this.loading = false;
      },
      error: err => {
        console.error('Error fetching orders:', err);
        this.errorMessage = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  /** ✅ Update order delivery status */
  updateOrderStatus(orderId: number, newStatus: string): void {
    const body = { newDeliveryStatus: newStatus };
    this.http.put(`http://localhost:8086/api/purchase-orders/${orderId}/status`, body, { responseType: 'text' })
      .subscribe({
        next: res => {
          alert(`Status updated: ${res}`);
          this.fetchOrders(); // Refresh
        },
        error: err => {
          alert(err.error?.message || 'Failed to update order status.');
        }
      });
  }
}
