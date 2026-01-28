import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
 

import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
 
@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  displayedColumns = ['productsId', 'productsName', 'category', 'productsUnitPrice', 'productsQuantity', 'actions'];
 
  showForm = false;
  isEdit = false;
 
  form = this.fb.group({
    productsId: [null as number | null, [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    productsName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
    productsDescription: [''],
    productsUnitPrice: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    productsQuantity: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    productsImage: [''],
    minStockThreshold: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    maxStockThreshold: [0, [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
    categoryId: [null as number | null, [Validators.required]],
  });
 
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}
 
  ngOnInit(): void {
    this.loadProducts();
    this.categoryService.getAll().subscribe(cats => (this.categories = cats));
  }
 
  loadProducts(): void {
    this.productService.getAll().subscribe(data => (this.products = data));
  }
 
  add(): void {
    this.showForm = true;
    this.isEdit = false;
    this.form.reset();
    this.form.get('productsId')?.enable();
  }
 
  edit(p: Product): void {
    this.showForm = true;
    this.isEdit = true;
    this.form.reset();
    this.form.patchValue({
      productsId: p.productsId,
      productsName: p.productsName,
      productsDescription: p.productsDescription,
      productsUnitPrice: p.productsUnitPrice,
      productsQuantity: p.productsQuantity,
      productsImage: p.productsImage,
      minStockThreshold: p.minStockThreshold,
      maxStockThreshold: p.maxStockThreshold,
      categoryId: p.category?.categoriesId ?? null,
    });
    this.form.get('productsId')?.disable();
  }
 
  delete(id: number): void {
    if (confirm('Delete this product?')) {
      this.productService.delete(id).subscribe(() => this.loadProducts());
    }
  }
 
  save(): void {
    const raw = this.form.getRawValue();
    const payload: Product = {
      productsId: raw.productsId!,
      productsName: raw.productsName!,
      productsDescription: raw.productsDescription || '',
      productsUnitPrice: raw.productsUnitPrice!,
      productsQuantity: raw.productsQuantity!,
      productsImage: raw.productsImage || '',
      minStockThreshold: raw.minStockThreshold!,
      maxStockThreshold: raw.maxStockThreshold!,
      manualQty: 0,
      category: {
        categoriesId: raw.categoryId!,
        categoryName: '',
      },
    };
 
    if (this.isEdit) {
      this.productService.update(payload.productsId, payload).subscribe(() => {
        this.cancel();
        this.loadProducts();
      });
    } else {
      this.productService.create(payload).subscribe(() => {
        this.cancel();
        this.loadProducts();
      });
    }
  }
 
  cancel(): void {
    this.showForm = false;
    this.isEdit = false;
    this.form.reset();
    this.form.get('productsId')?.enable();
  }
}
 
 