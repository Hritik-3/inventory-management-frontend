import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Supplier } from '../models/supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierContactService {

  private baseUrl = 'http://localhost:8086/api/suppliers';

  constructor(private http: HttpClient) {}

  // Load contacts
 getAllSuppliers(): Observable<Supplier[]> {
  return this.http.get<Supplier[]>(`${this.baseUrl}/contacts`).pipe(
    map((suppliers: any[]) =>
      suppliers.map(s => ({
        suppliersId: s.suppliersId,
        suppliersName: s.suppliersName,
        suppliersContactPerson: s.suppliersContactPerson,
        suppliersEmail: s.suppliersEmail,
        suppliersPhone: s.suppliersPhone,

        address: typeof s.address === "string"
          ? s.address
          : `${s.address?.addressStreet || ''} ${s.address?.addressCity || ''} ${s.address?.addressState || ''}`
      }))
    )
  );
}


  // Create supplier
  createSupplier(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // Delete supplier
  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Update contact
  updateSupplierContact(id: number, contactInfo: any): Observable<any> {
  return this.http.put(
    `${this.baseUrl}/${id}/contact`,
    {
      contactPerson: contactInfo.contactPerson,
      email: contactInfo.email,
      phone: contactInfo.phone
    }
  );
}


  // Delete contact only
  deleteSupplierContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/contact`);
  }
}
