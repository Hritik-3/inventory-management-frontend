import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { OrderService } from '../../../../services/order.service';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.css'
})
export class EditOrderComponent implements OnInit {
  orderId!: number;
  order: any;
  updateForm!: FormGroup;

  availableProducts = [
    { productId: 1001, productName: 'Washing Machine' },
    { productId: 1002, productName: 'Fridge' },
    { productId: 1003, productName: 'Dishwasher' },
    { productId: 1004, productName: 'Microwave' },
    { productId: 1005, productName: 'Tool Box' },
    { productId: 1006, productName: 'Hot Gun' },
    { productId: 1007, productName: 'Grinder/Saw' },
    { productId: 1008, productName: 'Spark Plug' },
    { productId: 1009, productName: 'ECUs' },
    { productId: 1010, productName: 'Batteries' },
    { productId: 1011, productName: 'Sensors' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.buildForm();
      },
      error: (err) => console.error(err)
    });
  }

  buildForm() {
   this.updateForm = this.fb.group({
  newExpectedDeliveryDate: [this.order.poExpectedDelivery_date || '', Validators.required],
  items: this.fb.array(
    this.order.items.map((item: any) =>
      this.fb.group({
        itemId: [item.itemId],
        oldQuantity: [item.quantity],
        newQuantity: [item.quantity, [Validators.required, Validators.min(1)]]
      })
    )
  )
});

  }

  get itemsFormArray(): FormArray {
    return this.updateForm.get('items') as FormArray;
  }

  addItem() {
  this.itemsFormArray.push(
    this.fb.group({
      itemId: [null],
      oldQuantity: [0],
      newQuantity: [1, [Validators.required, Validators.min(1)]]
    })
  );
}


  removeItem(index: number) {
    const itemId = this.itemsFormArray.at(index).value.itemId;

    if (!itemId) {
      this.itemsFormArray.removeAt(index);
      return;
    }

    if (confirm('Are you sure you want to remove this item from the order?')) {
      this.orderService.deleteOrderItem(itemId).subscribe({
        next: () => {
          this.itemsFormArray.removeAt(index);
          alert('Item removed successfully');
        },
        error: () => alert('Failed to remove item')
      });
    }
  }

  saveUpdate() {
    console.log('Form Value:', this.updateForm.value);
    console.log('Form Valid:', this.updateForm.valid);

    (this.updateForm.get('items') as FormArray).controls.forEach((ctrl, i) => {
      console.log('Item', i, ctrl.valid, ctrl.value);
    });

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      alert('Please fill all required fields');
      return;
    }

    this.orderService.updateOrder(this.orderId, this.updateForm.value).subscribe({
      next: () => {
        alert('Order updated successfully');
        // this.router.navigate(['/view-orders']);
      },
      error: () => alert('Failed to update order')
    });
  }

  cancelOrder() {
    if (confirm('Are you sure to cancel this order?')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: () => {
          alert('Order cancelled successfully');
          // this.router.navigate(['/view-orders']);
        },
        error: () => alert('Failed to cancel order')
      });
    }
  }
}
