// PRODUCTS.TS
// products.model.ts
export interface Category {
  categoriesId: number;
  categoryName: string;
}
 
export interface Product {
  productsId: number;
  productsName: string;
  productsUnitPrice: number;
  productsQuantity: number;
  minStockThreshold?: number;
  maxStockThreshold?: number;
  category?: Category;

  
}
 
 
 