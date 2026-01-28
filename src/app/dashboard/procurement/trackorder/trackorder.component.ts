import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-trackorderstatus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './trackorder.component.html',
  styleUrls: ['./trackorder.component.css']
})
export class TrackorderComponent {
  form: FormGroup;
  order: any = null;
  error: string = '';
 
  statusSteps: string[] = ['Pending', 'In-progress', 'Dispatched', 'Delivered'];
  currentStatusIndex: number = -1;
 
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      poId: ['', [Validators.required, Validators.min(1)]]
    });
  }
 
  onSubmit() {
    const poId = this.form.value.poId;
    this.order = null;
    this.error = '';
    this.currentStatusIndex = -1;
 
    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'You are not logged in.';
      return;
    }
 
    this.http.get(`http://localhost:8086/api/purchase-orders/${poId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (data) => {
        this.order = data;
        if (this.order && this.order.poDeliveryStatus) {
          this.currentStatusIndex = this.statusSteps.findIndex(
            s => s.toLowerCase() === this.order.poDeliveryStatus.toLowerCase()
          );
        }
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.error = 'Order not found or server error.';
      }
    });
  }
 
  getIcon(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';      // hourglass
      case 'in-progress': return '🔄'; // rotating arrows
      case 'dispatched': return '🚚';  // delivery truck
      case 'delivered': return '✅';   // check mark
      default: return '❓';             // question mark
    }
  }
 
  preventNegativeInput(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e' || event.key === '+') {
      event.preventDefault();
    }
  }
}
 
 