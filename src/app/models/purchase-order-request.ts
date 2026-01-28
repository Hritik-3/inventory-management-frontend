import { PurchaseOrderItemRequest } from "./purchase-order-item";


export interface PurchaseOrderRequest {
  supplierId: number;
  expectedDeliveryDate: string;
  items: PurchaseOrderItemRequest[];
  orderNotes?: string;
   materialName?: string;
}
