import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../models/product';
import { ProductService } from '../../../services/product.service';
import { ProductionScheduleService } from '../../../services/production-schedule.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  products: Product[] = [];
  stockFilter: 'all' | 'low' | 'within' | 'high' | 'above' = 'all';

  // 🔹 Modal state
  showScheduleModal = false;
  selectedProduct: Product | null = null;
  manualQty: number = 0;

  constructor(
    private productService: ProductService,
    private scheduleService: ProductionScheduleService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map(p => ({
          ...p,
          scheduled: p.scheduleStatus === 'PLANNED',
          completed: p.scheduleStatus === 'COMPLETED'
        }));
      },
      error: (err) => console.error('Error fetching products', err)
    });
  }

  // 🔹 Filter logic
  get filteredProducts(): Product[] {
    switch (this.stockFilter) {
      case 'low':
        return this.products.filter(p => p.productsQuantity < p.minStockThreshold);
      case 'within':
        return this.products.filter(
          p => p.productsQuantity >= p.minStockThreshold && p.productsQuantity < p.maxStockThreshold
        );
      case 'high':
        return this.products.filter(p => p.productsQuantity === p.maxStockThreshold);

      case 'above':
        return this.products.filter(p => p.productsQuantity > p.maxStockThreshold);
      default:
        return this.products;
    }
  }

  getAlertStatus(product: Product): string {
    if (product.productsQuantity < product.minStockThreshold) return 'Low Stock';
    else if (product.productsQuantity >= product.minStockThreshold && product.productsQuantity < product.maxStockThreshold) return 'Within Stock';
    else if (product.productsQuantity === product.maxStockThreshold) return 'Full';
    return 'OverStock';
  }


  getAlertClass(product: Product): string {
    const status = this.getAlertStatus(product);
    switch (status) {
      case 'Low Stock': return 'alert-box low-stock';
      case 'Within Stock': return 'alert-box normal';
      case 'Full': return 'alert-box full';
      case 'OverStock': return 'alert-box overstock';
      default: return 'alert-box';
    }
  }

  // 🔹 Open modal
  openScheduleModal(product: Product): void {
    this.selectedProduct = product;
    this.manualQty = 0;
    this.showScheduleModal = true;
  }

  // 🔹 Close modal
  closeScheduleModal(): void {
    this.showScheduleModal = false;
    this.selectedProduct = null;
  }

  // 🔹 Confirm schedule
  confirmSchedule(): void {
    if (!this.selectedProduct) return;
    if (this.manualQty <= 0) {
      alert('Please enter a valid quantity!');
      return;
    }

    const startDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    const endDate = new Date(Date.now() + 30 * 1000).toISOString(); 


    console.log("📤 Sending payload:", {
      productId: this.selectedProduct.productsId,
      startDate,
      endDate,
      quantity: this.manualQty
    });

    const token = localStorage.getItem('token');
    this.scheduleService.createSchedule(
      this.selectedProduct.productsId,
      startDate,
      endDate,
      this.manualQty,
    ).subscribe({
      next: (res) => {
        console.log("✅ Backend response:", res);
        alert(`Production scheduled for ${res.productName} - Qty: ${res.quantity}`);
        this.selectedProduct!.scheduled = true;
        this.closeScheduleModal();
      },
      error: (err) => {
        console.error("❌ Backend error:", err);
        alert(err.error?.message || 'Failed to schedule production');
      }
    });
  }

  // 🔹 Backend: auto schedule all low stock
  scheduleAllEligibleProducts(): void {
    const eligible = this.products.filter(
      p => !p.scheduled && !p.completed && p.productsQuantity < p.minStockThreshold
    );

    if (eligible.length === 0) {
      alert('No eligible low stock products to schedule.');
      return;
    }

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    this.scheduleService.autoScheduleAll(userId!).subscribe({
      next: (res) => {
        alert(res);
        this.loadProducts();
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to auto schedule all');
      }
    });
  }

  // 🔹 Backend: complete all production schedules
  completeAllProduction(): void {
    const userId = localStorage.getItem('userId');
     console.log("🔹 Performing Complete All with userId:", userId);
    const token = localStorage.getItem('token');

    this.scheduleService.completeAll(userId!).subscribe({
      next: (res) => {
        alert(res);
        this.loadProducts();
        console.log("✅ All production schedules completed");
      },
      error: (err) => {
        alert(err.error?.message || 'Failed to complete all production schedules');
      }
    });
  }
}
