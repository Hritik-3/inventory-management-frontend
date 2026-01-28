import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionTrackingService, ProductionOrder } from '../../../services/production-tracking.service';
 
@Component({
  selector: 'app-track-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './track-orders.component.html',
  styleUrls: ['./track-orders.component.css']
})
export class TrackOrdersComponent implements OnInit, OnDestroy {
  productionOrders: ProductionOrder[] = [];
  filteredOrders: ProductionOrder[] = [];
  searchId: number | null = null;
  errorMessage: string | null = null;
 
  private refreshInterval: any;
 
  constructor(private trackingService: ProductionTrackingService) {}
 
  ngOnInit(): void {
    this.loadOrders();
 
    // Auto-refresh every 10 seconds
    this.refreshInterval = setInterval(() => {
      this.loadOrders();
    }, 10000);
  }
 
  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
 
  // Load all orders from backend
  loadOrders(): void {
    this.trackingService.getAllOrders().subscribe({
      next: (data) => {
        this.productionOrders = data.map(order => ({
          ...order,
          actionTaken: !!order.actions && order.actions !== 'PENDING' // disable buttons if already acted
        }));
 
        this.filteredOrders = this.searchId
          ? this.productionOrders.filter(o => o.scheduleId === this.searchId)
          : this.productionOrders;
 
        this.errorMessage = null;
      },
      error: () => {
        this.errorMessage = 'Failed to load production orders. Please try again later.';
      }
    });
  }
 
  // Search for order by scheduleId
  searchOrder(): void {
    if (!this.searchId) {
      this.filteredOrders = this.productionOrders;
      this.errorMessage = null;
      return;
    }
 
    this.trackingService.getOrderById(this.searchId).subscribe({
      next: (order) => {
        this.filteredOrders = [{
          ...order,
          actionTaken: !!order.actions && order.actions !== 'PENDING'
        }];
        this.errorMessage = null;
      },
      error: () => {
        this.filteredOrders = [];
        this.errorMessage = `No order found with Schedule ID: ${this.searchId}`;
      }
    });
  }
 
  resetSearch(): void {
    this.searchId = null;
    this.filteredOrders = this.productionOrders;
    this.errorMessage = null;
  }
 
  // ✅ Call backend to update action
  handleAction(order: ProductionOrder, action: string): void {
  order.actionTaken = true; // disable button instantly
 
  this.trackingService.updateActions(order.scheduleId, action.toUpperCase())
    .subscribe({
      next: (response: string) => {
        order.actions = action.toUpperCase();
        console.log(`✅ ${response}`); // e.g., "Actions updated to: RECEIVED"
      },
      error: () => {
        this.errorMessage = `Failed to update action for Schedule ID: ${order.scheduleId}`;
        order.actionTaken = false; // re-enable button if failed
      }
    });
}
 
 
}
 
 