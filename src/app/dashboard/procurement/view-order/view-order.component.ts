import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { OrderItem, PurchaseOrder } from '../../../models/return';
import { ReturnOrderService } from '../../../services/return.service';
import { ConfirmReturnModalComponent } from './confirm-return-modal/confirm-return-modal.component';
import { OrderService } from '../../../services/order.service';
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-view-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmReturnModalComponent, RouterModule],
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.css']
})
export class ViewOrderComponent implements OnInit {

  orders: PurchaseOrder[] = [];
  filtered: PurchaseOrder[] = [];

  searchOrderId: string = '';
  searchCustomer: string = '';
  filterDate: string = '';

  showModal: boolean = false;
  selectedItem: OrderItem | null = null;
  selectedPoId: number | null = null;
  modalDeliveryStatus: string | null = null; // Delivery status for modal

  constructor(
    private orderService: ReturnOrderService,
    private ordersService: OrderService,
    private router: Router,
    private location: Location
  ) {}
  
  ngOnInit(): void {
    this.fetchOrders();
  }

  /** 🔹 Fetch all orders from backend */
  fetchOrders(): void {
    this.ordersService.getAllOrders().subscribe({
      next: (data: PurchaseOrder[]) => {
        this.orders = data.sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error fetching orders', err);
      }
    });
  }

  /** 🔹 Apply search + filter logic */
  applyFilters(): void {
    this.filtered = this.orders.filter(order =>
      (!this.searchOrderId || order.poId.toString().includes(this.searchOrderId)) &&
      (!this.searchCustomer || order.customerName.toLowerCase().includes(this.searchCustomer.toLowerCase())) &&
      (!this.filterDate || order.orderDate === this.filterDate)
    );
  }

  /** 🔹 Number of orders that have any returned items */
  get returnedOrdersCount(): number {
    return this.orders.filter(order =>
      order.items.some(item => item.returnedQuantity > 0)
    ).length;
  }

  /** 🔹 Number of orders that have pending returns */
  get pendingReturnsCount(): number {
    return this.orders.filter(order =>
      order.items.some(item => !item.returnedQuantity || item.returnedQuantity < item.quantity)
    ).length;
  }

  /** 🔹 Open the return modal for a specific order item */
  returnItem(poId: number, purchaseOrderItemId: number): void {
    const order = this.orders.find(order => order.poId === poId);
    if (!order) return;

    const item = order.items.find(item => item.purchaseOrderItemId === purchaseOrderItemId);
    if (!item) return;

    this.selectedItem = item;
    this.selectedPoId = poId;
    this.modalDeliveryStatus = order.deliveryStatus ?? null;
    this.showModal = true;
  }

  /** 🔹 Close the modal and reset selection */
  handleModalClose(): void {
    this.showModal = false;
    this.selectedItem = null;
    this.selectedPoId = null;
    this.modalDeliveryStatus = null;
  }

  /** 🔹 Confirm return and send to backend */
  handleModalConfirm(data: any): void {
    if (!this.selectedPoId) return;

    const payload = {
      purchaseOrderId: this.selectedPoId,
      returnedByUserId: localStorage.getItem('userId') || '',
      returnReason: data.returnReason || 'Customer Request',
      status: 'Pending',
      items: [
        {
          purchaseOrderItemId: data.purchaseOrderItemId,
          productId: data.productId,
          quantity: Number(data.quantity),
          conditionNote: data.conditionNote || ''
        }
      ]
    };

    console.log('Payload to backend:', payload);

    this.orderService.submitReturn(payload).subscribe({
      next: () => {
        console.log('Return submitted successfully');
        alert('Return submitted successfully!');
        this.handleModalClose();
        this.fetchOrders();
      },
      error: (err) => {
        console.error('Error submitting return', err);
        alert('Failed to submit return. Please try again.');
        this.handleModalClose();
      }
    });
  }

  downloadReport(poId: number): void {
  window.open(`http://localhost:8086/api/reports/purchase-order/${poId}`, '_blank');
}


  /** 🔹 Clear all filters */
  clearFilters(): void {
    this.searchOrderId = '';
    this.searchCustomer = '';
    this.filterDate = '';
    this.filtered = [...this.orders];
  }

  /** 🔹 Navigate to Return Details page */
  viewReturn(): void {
    this.router.navigate(['/procurement/view-return']);
  }

  goBack(): void {
  this.location.back(); // ⬅️ Navigates to previous page
}
}
