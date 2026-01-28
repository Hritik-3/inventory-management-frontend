//STOCK-VIEW.COMPONENT.TS
 
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/products.service';
import { Product } from '../../../models/products';
 
@Component({
  selector: 'app-stock-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stock-view.component.html',
  styleUrls: ['./stock-view.component.css']
})
export class StockViewComponent implements OnInit {
  allProducts: Product[] = []; // full list of products
  products: Product[] = [];    // products currently displayed
  searchText: string = '';
  selectedCategoryId: number = 0; // default "All Categories"
 
  allCategories: { categoriesId: number; categoryName: string }[] = [];
 
  editingProductId?: number;
  editMin?: number;
  editMax?: number;
 
  constructor(private productService: ProductService) {}
 
  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.allProducts = data;
        this.products = data;
        this.extractAllCategories(data);
      },
      (err) => console.error(err)
    );
  }
 
  extractAllCategories(products: Product[]): void {
    const categoriesMap = new Map<number, string>();
    products.forEach(p => {
      if (p.category) categoriesMap.set(p.category.categoriesId, p.category.categoryName);
    });
    this.allCategories = Array.from(categoriesMap, ([categoriesId, categoryName]) => ({ categoriesId, categoryName }));
  }
 
  fetchProducts(): void {
    // Start with all products
    let filtered = [...this.allProducts];
 
    // Apply category filter
    if (this.selectedCategoryId && this.selectedCategoryId !== 0) {
      filtered = filtered.filter(p => p.category?.categoriesId === this.selectedCategoryId);
    }
 
    // Apply search filter
    if (this.searchText) {
      filtered = filtered.filter(p => p.productsName.toLowerCase().includes(this.searchText.toLowerCase()));
    }
 
    this.products = filtered;
  }
 
  filterByCategory(categoryId?: number): void {
    this.selectedCategoryId = categoryId === 0 ? 0 : categoryId!;
    this.fetchProducts();
  }
 
  onSearchChange(): void {
    this.fetchProducts();
  }
 
  startEdit(productId: number): void {
    const product = this.products.find(p => p.productsId === productId);
    if (!product) return;
 
    this.editingProductId = productId;
    this.editMin = product.minStockThreshold;
    this.editMax = product.maxStockThreshold;
  }
 
 
 
 
    /*saveThresholds(): void {
  if (this.editingProductId === undefined) return;
 
  const product = this.products.find(p => p.productsId === this.editingProductId);
  if (!product) return;
 
  // 🔹 Validation: min cannot exceed max
  if (product.minStockThreshold !== undefined && product.maxStockThreshold !== undefined) {
    if (product.minStockThreshold > product.maxStockThreshold) {
      alert('Min Threshold cannot exceed Max Threshold!');
      return;
    }
  }
 
  this.productService.updateProductThresholds(
    product.productsId,
    product.minStockThreshold,
    product.maxStockThreshold
  ).subscribe(
    (updatedProduct) => {
      const index = this.products.findIndex(p => p.productsId === this.editingProductId);
      if (index !== -1) this.products[index] = updatedProduct;
      this.cancelEdit();
    },
    (err) => console.error(err)
  );
}*/
 
saveThresholds(): void {
  if (this.editingProductId === undefined) return;
 
  const product = this.products.find(p => p.productsId === this.editingProductId);
  if (!product) return;
 
  // 🔹 Validation: values cannot be negative
  if ((product.minStockThreshold ?? 0) < 0 || (product.maxStockThreshold ?? 0) < 0) {
    alert('Threshold values cannot be negative!');
    return;
  }
 
  // 🔹 Validation: min cannot exceed max
  if ((product.minStockThreshold ?? 0) > (product.maxStockThreshold ?? 0)) {
    alert('Min Threshold cannot exceed Max Threshold!');
    return;
  }
 
  // ✅ If validations pass, call backend
  this.productService.updateProductThresholds(
    product.productsId,
    product.minStockThreshold,
    product.maxStockThreshold
  ).subscribe(
    (updatedProduct) => {
      const index = this.products.findIndex(p => p.productsId === this.editingProductId);
      if (index !== -1) this.products[index] = updatedProduct;
      this.cancelEdit();
    },
    (err) => console.error(err)
  );
}
 
 
 
  cancelEdit(): void {
    this.editingProductId = undefined;
    this.editMin = undefined;
    this.editMax = undefined;
  }
 
  updateStock(productId: number, change: number): void {
    this.productService.updateProductStock(productId, change).subscribe(
      () => this.fetchProducts(),
      (err) => console.error(err)
    );
  }
 
  isBelowThreshold(product: Product): boolean {
    return product.productsQuantity < (product.minStockThreshold ?? 0);
  }
}
 
 
 