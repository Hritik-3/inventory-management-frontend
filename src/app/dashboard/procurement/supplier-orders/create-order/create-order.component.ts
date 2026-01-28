import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Suppliers } from '../../../../models/supplier';
import { RawMaterial } from '../../../../models/raw-material';
import { PurchaseOrderRequest } from '../../../../models/purchase-order-request';
import { OrderService } from '../../../../services/order.service';
import { PurchaseOrderItem } from '../../../../models/supplier-order';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  supplier?: Suppliers;
  availableMaterials: RawMaterial[] = [];
  orderItems: PurchaseOrderItem[] = [];

  selectedMaterial?: RawMaterial;
  selectedQuantity: number = 1;
  deliveryDate: string = '';
  orderNotes: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const supplierId = Number(this.route.snapshot.paramMap.get('supplierId'));

    // Fetch supplier
    this.orderService.getSupplierById(supplierId).subscribe({
      next: (data) => this.supplier = data,
      error: (err) => console.error('❌ Error fetching supplier', err)
    });

    // Fetch materials for this supplier
    this.orderService.getMaterialsBySupplier(supplierId).subscribe({
      next: (data) => this.availableMaterials = data,
      error: (err) => console.error('❌ Error fetching materials', err)
    });
  }

  /** Add selected material to order */
  addToOrder() {
    if (!this.selectedMaterial || this.selectedQuantity <= 0) return;

    this.orderItems.push({
      rWId: this.selectedMaterial.rwId,
      quantity: this.selectedQuantity
    });

    this.selectedMaterial = undefined;
    this.selectedQuantity = 1;
  }

  /** Remove item from order */
  removeItem(index: number) {
    this.orderItems.splice(index, 1);
  }

  /** Lookup material name from rWId */
  getMaterialName(rwId: number): string {
    const material = this.availableMaterials.find(m => m.rwId === rwId);
    return material ? material.rwName : 'Unknown';
  }

  /** Submit the supplier order */
  checkoutOrder() {
    if (!this.supplier || !this.deliveryDate || this.orderItems.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const order: PurchaseOrderRequest = {
      supplierId: this.supplier.suppliersId,
      expectedDeliveryDate: this.deliveryDate,
      items: this.orderItems.map(item => {
        const material = this.availableMaterials.find(m => m.rwId === item.rWId)!;
        return {
          rWId: material.rwId,
          quantity: item.quantity,
          cost: material.rwUnitPrice
        };
      }),
      orderNotes: this.orderNotes
    };

    console.log('Final Supplier Order Payload:', order);
    console.log('Final Supplier Order Payload Checking:', order);

    this.orderService.createSupplierOrder(order).subscribe({
      next: () => {
        alert('✅ Supplier Order created successfully!');

        //checking now
        this.router.navigate(['/procurement/supplier-orders']);
      },
      error: (err) => alert('❌ Failed to create supplier order: ' + err.message)
    });
  }
}
