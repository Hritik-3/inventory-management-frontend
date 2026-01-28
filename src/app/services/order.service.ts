import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suppliers } from '../models/supplier';
import { RawMaterial } from '../models/raw-material';
import { PurchaseOrderRequest } from '../models/purchase-order-request';
import { PurchaseOrder } from '../models/return';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8086/api';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.baseUrl}/getallorders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getOrderById(orderId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${orderId}`);
  }

  updateOrder(orderId: number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}`, payload, { responseType: 'text' });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/orders/${orderId}/cancel`, {}, { responseType: 'text' });
  }

  deleteOrderItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/order-items/${itemId}`, { responseType: 'text' });
  }

  getRawMaterialsBySupplier(supplierId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/raw-materials/supplier/${supplierId}`);
  }

  searchRawMaterials(query: string) {
    return this.http.get<any[]>(`${this.baseUrl}/raw-materials/search?query=${query}`);
  }

  // ✅ Correct Supplier Order Creation (uses PurchaseOrderRequest)
  createSupplierOrder(payload: PurchaseOrderRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/purchase-orders`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text'
    });
  }

  ////////////////////////////////////////////////////////////

  private supplierUrl = `${this.baseUrl}/suppliers`;
  getSuppliers(): Observable<Suppliers[]> {
    return this.http.get<Suppliers[]>(this.supplierUrl);
  }

  getSupplierById(id: number): Observable<Suppliers> {
    return this.http.get<Suppliers>(`${this.supplierUrl}/${id}`);
  }

  ////////////////////////////////////////////////////////////

  private rawmaterialUrl = `${this.baseUrl}/raw-materials`;

  getMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.rawmaterialUrl);
  }

  getMaterialsBySupplier(supplierId: number): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.rawmaterialUrl}/supplier/${supplierId}`);
  }

  ////////////////////////////////////////////////////////////

  private purchaseUrl = `${this.baseUrl}/purchase-orders`;

  createOrder(order: PurchaseOrder): Observable<any> {
    return this.http.post(this.purchaseUrl, order, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      responseType: 'text'
    });
  }

  getSupplierForMaterial(materialId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/materials/${materialId}/supplier`);
  }

  private rawUrl = `${this.baseUrl}/raw-material`;

  getSuppliersByMaterial(materialId: number): Observable<Suppliers[]> {
    return this.http.get<Suppliers[]>(`${this.rawUrl}/${materialId}/suppliers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
}
