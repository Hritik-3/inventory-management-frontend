export interface RawMaterial {
  
  rwId: number;
  rwName: string;
  rwDescription: string;
  rwQuantity: number;
  rwUnitPrice: number;   // ✅ add this
  rwSupplierId?: number;
  rwImage?: string;
}
 
 