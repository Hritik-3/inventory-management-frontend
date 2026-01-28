import { Address } from "./users";

export interface Suppliers{
    suppliersId :number;
    suppliersName:string;
    suppliersPhone: string;
    suppliersEmail:string;
    suppliersContactPerson:string;
    address:Address;
    
}
export interface Supplier {
  suppliersId: number;
  suppliersName: string;
  suppliersContactPerson: string;
  suppliersEmail: string;
  suppliersPhone: string;
  address?: Address;  

  // ⭐ Added for rating module
  rating?: number;
  comment?: string;
}