export interface ProcurementPurchaseOrderDTO {
  poId: number;
  orderDate: string;
  expectedDelivery: string;
  deliveryStatus: string;

  supplierName?: string;
  customerName?: string;

  orderType?: 'SUPPLIER_ORDER' | 'CUSTOMER_ORDER';
}
