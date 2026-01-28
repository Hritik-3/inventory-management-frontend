export interface PurchaseOrderItem {
  rWId: number;
  quantity: number;
}
 
export interface PurchaseOrder {
  supplierId: number;
  expectedDeliveryDate: string;
  items: PurchaseOrderItem[];
}
 
 