import { Category } from "./category";



export interface Product {
  productsId: number;
  productsName: string;
  productsQuantity: number;
  minStockThreshold: number;
  maxStockThreshold: number;
  scheduleStatus?: string;   
  scheduled?: boolean;  // ✅ optional
  completed?: boolean;
  manualQty: number;




  //   productsId: number;
  // productsName: string;
  productsDescription: string;
  productsUnitPrice: number;
  // productsQuantity: number;
  productsImage: string;
  // minStockThreshold: number;
  // maxStockThreshold: number;
  category: Category; // { categoriesId, categoryName }
}
