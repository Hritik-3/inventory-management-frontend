import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = 'http://localhost:8086/api/customers';

  constructor(private http: HttpClient) {}

  // GET: All customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.baseUrl);
  }

  // GET: Single customer by ID
  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/id/${customerId}`);
  }

  // POST: Create new customer
  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/create/customer`, customer);
  }

  // PUT: Update existing customer
  updateCustomer(customerId: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/${customerId}`, customer);
  }

  // DELETE: Soft delete customer
  deleteCustomer(customerId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${customerId}`, { responseType: 'text' });
  }
}
