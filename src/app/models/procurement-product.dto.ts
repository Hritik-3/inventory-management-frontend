export interface ProcurementProductDTO {
  id: number;
  name: string;
  quantity: number;
  minStockThreshold: number;
  maxStockThreshold: number;
  supplierName: string;
}
