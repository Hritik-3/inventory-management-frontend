import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-confirm-return-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './confirm-return-modal.component.html',
  styleUrls: ['./confirm-return-modal.component.css']
})
export class ConfirmReturnModalComponent implements OnChanges {
  @Input() item: any; // Should contain itemId, productId, productName, quantity, returnedQuantity
  @Input() poId: number | null = null;
  @Input() podeliveryStatus: string | null = null; // 🔹 New input

  @Output() confirm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  selectedQuantity: number = 1;
  conditionNote: string = '';
  canReturn: boolean = false; // 🔹 Flag to check if return is allowed

  ngOnChanges(changes: SimpleChanges): void {
    if (this.item) {
      const remaining = this.item.quantity - (this.item.returnedQuantity ?? 0);
      this.selectedQuantity = Math.min(1, remaining);
    }

    // 🔹 Only allow return if PO is delivered
    this.canReturn = this.podeliveryStatus?.toUpperCase() === 'DELIVERED';
  }

  onConfirm(): void {
    if (!this.item || !this.poId) return;

    if (!this.canReturn) {
      alert('Return is only allowed for delivered orders.');
      console.log('delivery status is', this.podeliveryStatus);
      return;
    }

    if (!this.selectedQuantity || this.selectedQuantity < 1) {
      alert('Please enter a valid return quantity.');
      return;
    }

    console.log('Item before emit:', this.item);

    const payload = {
      purchaseOrderId: this.poId,
      purchaseOrderItemId: this.item.itemId,
      productId: this.item.productId,
      quantity: this.selectedQuantity,
      conditionNote: this.conditionNote
    };

    console.log('Payload to emit:', payload);

    this.confirm.emit(payload);
  }
}
