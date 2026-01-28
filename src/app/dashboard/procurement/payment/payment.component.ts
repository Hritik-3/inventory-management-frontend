import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
 
interface Payment {
  id: number;
  orderId: number;
  amount: number;
  paymentDate: string;
  status: string;
}
 
interface OrderItem {
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
}
 
interface Invoice {
  orderId: number;
  billingAddress: string;
  phoneNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  totalPrice: number;
}
 
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  orderId: number | null = null;
  paymentMethod: string = '';
 
  message: string = '';
  loading: boolean = false;
  success: boolean = false;
  error: boolean = false;
 
  payments: Payment[] = [];
  invoiceData: Invoice | null = null;
  orderValid: boolean = false;
  paymentAlreadyDone: boolean = false;
 
  constructor(private http: HttpClient) {}
 
  ngOnInit(): void {
    this.loadPayments();
  }
 
  allowOnlyPositive(event: KeyboardEvent) {
    const charCode = event.key;
    if (!/^\d$/.test(charCode)) {
      event.preventDefault();
    }
  }
 
  validateOrderId(): void {
    if (!this.orderId || this.orderId <= 0) {
      this.setMessage('Please enter a valid Order ID.', false);
      this.orderValid = false;
      this.invoiceData = null;
      this.paymentAlreadyDone = false;
      return;
    }
 
    this.loading = true;
 
    // Check if payment already exists
    const existingPayment = this.payments.find(p => p.orderId === this.orderId && p.status === 'SUCCESS');
    this.paymentAlreadyDone = !!existingPayment;
 
    this.http.get<Invoice>(`http://localhost:8086/api/invoices/generate/${this.orderId}`).subscribe({
      next: (data) => {
        this.invoiceData = data;
        this.orderValid = true;
        const msg = this.paymentAlreadyDone
          ? 'Payment is already completed for this Order ID.'
          : 'Order ID is valid.';
        this.setMessage(msg, !this.paymentAlreadyDone);
        this.loading = false;
      },
      error: () => {
        this.setMessage('Order ID does not exist.', false);
        this.orderValid = false;
        this.invoiceData = null;
        this.paymentAlreadyDone = false;
        this.loading = false;
      }
    });
  }
 
  makePayment(): void {
    if (!this.orderId || this.orderId <= 0) {
      this.setMessage('Please enter a valid Order ID.', false);
      return;
    }
 
    if (!this.paymentMethod) {
      this.setMessage('Please select a payment method.', false);
      return;
    }
 
    const existingPayment = this.payments.find(p => p.orderId === this.orderId && p.status === 'SUCCESS');
    if (existingPayment) {
      this.setMessage('Payment is already completed for this Order ID.', false);
      this.paymentAlreadyDone = true;
      return;
    }
 
    this.loading = true;
    this.message = '';
    this.success = false;
    this.error = false;
 
    const payload = { method: this.paymentMethod };
 
    this.http.post(`http://localhost:8086/api/payments/orders/${this.orderId}/pay`, payload).subscribe({
      next: () => {
        this.setMessage('Payment Successful!', true);
        this.paymentAlreadyDone = true;
        this.loading = false;
        this.loadPayments();
      },
      error: (err) => {
        if (err.status === 409) {
          this.setMessage('Payment is already completed for this Order ID.', false);
          this.paymentAlreadyDone = true;
        } else {
          this.setMessage('Payment Failed! Please try again.', false);
        }
        this.loading = false;
      }
    });
  }
 
  loadPayments(): void {
    this.http.get<Payment[]>('http://localhost:8086/api/payments/all').subscribe({
      next: (data) => this.payments = data,
      error: (err) => console.error('Failed to load payments', err)
    });
  }
 
  downloadInvoicePdf(): void {
    if (!this.orderId || this.paymentAlreadyDone) return;
 
    this.http.get(`http://localhost:8086/api/invoices/pdf/${this.orderId}`, {
      responseType: 'blob'
    }).subscribe({
      next: (blob) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `invoice_${this.orderId}.pdf`;
        link.click();
      },
      error: () => {
        console.error('PDF download failed');
        this.setMessage('Failed to download PDF.', false);
      }
    });
  }
  
 
  private setMessage(message: string, isSuccess: boolean): void {
    this.message = message;
    this.success = isSuccess;
    this.error = !isSuccess;
  }
}
 
 