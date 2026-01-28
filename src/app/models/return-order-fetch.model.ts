export interface ReturnOrderItemFetch {
  roiId: number;
  returnQuantity: number;
  conditionNote: string;
  productId: number;
  productName: string;
  purchaseOrderItemId: number;
}

export interface ReturnOrderFetch {
  roId: number;
  roReturnDate: string;   // ISO date string from backend
  roReturnReason: string;
  roStatus: string;
  purchaseOrderId: number;
  returnedByUserId: string;
  items: ReturnOrderItemFetch[];
}
