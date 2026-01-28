export interface OrderItem {
  purchaseOrderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  returnedQuantity: number;
  price?: number;

  selectedForReturn?: boolean;
  conditionNote?: string;
  returnQuantity?: number;
}

export interface PurchaseOrder {
  poId: number;
  orderDate: string;
  deliveryStatus: string;
  totalAmount: number;
  customerName: string;

  supplierId?: number;
  expectedDeliveryDate?: string;
  items: OrderItem[];
  status?: string;
}

export interface ReturnItemPayload {
  purchaseOrderItemId: number;
  productId: number;
  quantity: number;
  conditionNote: string;
}

export interface ApiResponse {
  message: string;
  status: string;
  timestamp: string;
}
