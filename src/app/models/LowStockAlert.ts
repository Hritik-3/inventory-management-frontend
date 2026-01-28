export interface LowStockAlert {
  id: number;
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  status: string;
  createdAt: string; // ISO string from backend
}
 
 