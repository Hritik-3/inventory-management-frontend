import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../../models/category';
 
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns = ['categoriesId', 'categoryName', 'actions'];
 
  // state flags
  showForm = false;
  isEdit = false;
 
  // form
  form = this.fb.group({
    categoriesId: [null as number | null, [Validators.required]],
    categoryName: ['', [Validators.required, Validators.maxLength(100)]],
  });
 
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {}
 
  ngOnInit(): void {
    this.load();
  }
 
  load(): void {
    this.categoryService.getAll().subscribe((data: Category[]) => {
      this.categories = data;
    });
  }
 
  // ---------- List Actions ----------
  add(): void {
    this.showForm = true;
    this.isEdit = false;
    this.form.reset();
  }
 
  edit(cat: Category): void {
    this.showForm = true;
    this.isEdit = true;
    this.form.reset();
    this.form.patchValue(cat);
    this.form.get('categoriesId')?.disable(); // keep ID fixed
  }
 
  delete(id: number): void {
    if (confirm('Delete this category?')) {
      this.categoryService.delete(id).subscribe(() => this.load());
    }
  }
 
  // ---------- Form Actions ----------
  save(): void {
    const raw = this.form.getRawValue();
    const payload: Category = {
      categoriesId: raw.categoriesId!,
      categoryName: raw.categoryName!,
    };
 
    if (this.isEdit) {
      this.categoryService.update(payload.categoriesId, payload)
        .subscribe(() => {
          this.cancel();
          this.load();
        });
    } else {
      this.categoryService.create(payload)
        .subscribe(() => {
          this.cancel();
          this.load();
        });
    }
  }
 
  cancel(): void {
    this.showForm = false;
    this.isEdit = false;
    this.form.reset();
    this.form.get('categoriesId')?.enable(); // re-enable for next add
  }
}
 
 