//PRODUCTS.SERVICE.TS
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8086/api/products';
 
  constructor(private http: HttpClient) {}
 
  // Fetch all products
  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Fetch products by category
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Update min/max thresholds
  updateProductThresholds(productId: number, min?: number, max?: number): Observable<Product> {
    const token = localStorage.getItem('token');
    return this.http.put<Product>(`${this.apiUrl}/${productId}/thresholds`, {
      minStockThreshold: min,
      maxStockThreshold: max
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Update product stock
  updateProductStock(productId: number, change: number): Observable<string> {
    const token = localStorage.getItem('token');
    return this.http.put<string>(`${this.apiUrl}/${productId}/stock?change=${change}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Get products below threshold
  getProductsBelowThreshold(): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(`${this.apiUrl}/below-threshold`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Get products below threshold by category
  getProductsBelowThresholdByCategory(categoryId: number): Observable<Product[]> {
    const token = localStorage.getItem('token');
    return this.http.get<Product[]>(`${this.apiUrl}/below-threshold/category/${categoryId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
 
  // Get single product stock info
  getProductStockInfo(productId: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get<any>(`${this.apiUrl}/${productId}/stock-info`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}
 
 