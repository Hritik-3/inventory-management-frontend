import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../../../models/customer';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';
import { OrderItem } from '../../../models/order-item';
import { InternalOrderRequest } from '../../../models/internal-order-request';
import { BackButtonComponent } from '../../../back-button/back-button.component';

interface Product {
  productsId: number;
  productsName: string;
  productsUnitPrice: number;
  productsQuantity: number;
}

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.css',
})
export class OrderProductsComponent {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  productSearchTerm: string = '';

  selectedCustomer: Customer | null = null;
  priority: string = 'Medium Priority';
  expectedDate: string = '';
  notes: string = '';
  customers: Customer[] = [];
  selectedProduct: Product | null = null;
  quantity: number = 1;
  addedItems: any[] = [];

  // 🔹 for editing functionality
  editingItem: any = null;

  constructor(
    private customerservice: CustomerService,
    private orderservice: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchCustomers();
    this.fetchProducts();
  }

  fetchCustomers() {
    this.customerservice.getCustomers().subscribe({
      next: (data) => (this.customers = data),
      error: (err) => console.error('Error fetching customers', err),
    });
  }

  fetchProducts(): void {
    this.http.get<Product[]>('http://localhost:8086/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error('Error fetching products', err),
    });
  }

  onProductSearchChange(): void {
    const term = this.productSearchTerm.trim().toLowerCase();
    this.filteredProducts = term
      ? this.products.filter(
          (p) =>
            p.productsName.toLowerCase().includes(term) ||
            p.productsId.toString().includes(term)
        )
      : this.products;
  }

  selectProduct(product: Product): void {
    this.selectedProduct = product;
    this.productSearchTerm = product.productsName;
    this.filteredProducts = [];
  }

  addItem(): void {
    if (!this.selectedProduct || this.quantity < 1) return;

    const existing = this.addedItems.find(
      (i) => i.productsId === this.selectedProduct!.productsId
    );
    if (existing) {
      existing.quantity += this.quantity;
      existing.total = existing.quantity * existing.productsUnitPrice;
    } else {
      this.addedItems.push({
        productsId: this.selectedProduct.productsId,
        productsName: this.selectedProduct.productsName,
        productsUnitPrice: this.selectedProduct.productsUnitPrice,
        productsQuantity: this.selectedProduct.productsQuantity,
        quantity: this.quantity,
        total: this.quantity * this.selectedProduct.productsUnitPrice,
      });
    }

    this.resetProductSelection();
  }

  // 🔹 start editing
  editItem(item: any): void {
    this.editingItem = item;
    this.selectedProduct = this.products.find(
      (p) => p.productsId === item.productsId
    ) || null;
    this.quantity = item.quantity;
  }

  saveEditedItem(): void {
    if (!this.editingItem || !this.selectedProduct) return;

    this.editingItem.productsId = this.selectedProduct.productsId;
    this.editingItem.productsName = this.selectedProduct.productsName;
    this.editingItem.productsUnitPrice = this.selectedProduct.productsUnitPrice;
    this.editingItem.quantity = this.quantity;
    this.editingItem.total =
      this.quantity * this.selectedProduct.productsUnitPrice;

    this.editingItem = null;
    this.resetProductSelection();
  }

  removeItem(item: any): void {
    this.addedItems = this.addedItems.filter(
      (i) => i.productsId !== item.productsId
    );
  }

  get totalQuantity(): number {
    return this.addedItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalValue(): number {
    return this.addedItems.reduce((sum, item) => sum + item.total, 0);
  }

  submitOrder(): void {
    if (!this.selectedCustomer) {
      alert('Please select a customer before submitting the order.');
      return;
    }

    const items: OrderItem[] = this.addedItems.map((item) => ({
      productsId: item.productsId,
      quantity: item.quantity,
    }));

    const order: InternalOrderRequest = {
      customerId: this.selectedCustomer.id,
      priority: this.priority,
      expectedDate: this.expectedDate,
      notes: this.notes,
      items: items,
    };

    this.http
      .post('http://localhost:8086/api/internal-order', order, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'text',
      })
      .subscribe({
        next: (res) => {
          console.log('Order submitted successfully:', res);
          alert('Order submitted successfully!');
          this.resetForm();
          this.fetchProducts();
        },
        error: (err) => {
          console.error('Failed to submit order:', err);
          alert('Failed to submit order');
        },
      });
  }

  resetForm(): void {
    this.selectedCustomer = null;
    this.priority = 'Medium Priority';
    this.expectedDate = '';
    this.notes = '';
    this.addedItems = [];
    this.productSearchTerm = '';
    this.selectedProduct = null;
    this.editingItem = null;
  }

  private resetProductSelection(): void {
    this.selectedProduct = null;
    this.quantity = 1;
    this.productSearchTerm = '';
    this.filteredProducts = this.products;
  }
}
