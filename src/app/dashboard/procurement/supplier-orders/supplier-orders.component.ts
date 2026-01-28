import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Suppliers } from '../../../models/supplier';
import { RawMaterial } from '../../../models/raw-material';
import { OrderService } from '../../../services/order.service';
import { BackButtonComponent } from '../../../back-button/back-button.component';

@Component({
  selector: 'app-supplier-orders',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterModule,
    BackButtonComponent
  ],
  templateUrl: './supplier-orders.component.html',
  styleUrls: ['./supplier-orders.component.css']
})
export class SupplierOrdersComponent implements OnInit {
  suppliers: Suppliers[] = [];
  materials: RawMaterial[] = [];

  filteredSuppliers: Suppliers[] = [];
  filteredMaterials: RawMaterial[] = [];

  searchQuery: string = '';
  tab: 'suppliers' | 'materials' = 'suppliers';

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  /** 🔹 Load suppliers and materials */
  loadData(): void {
    this.orderService.getSuppliers().subscribe({
      next: (data: Suppliers[]) => {
        this.suppliers = data;
        this.filteredSuppliers = data;
      },
      error: (err) => console.error('❌ Error loading suppliers', err)
    });

    this.orderService.getMaterials().subscribe({
      next: (data: RawMaterial[]) => {
        this.materials = data;
        this.filteredMaterials = data;
      },
      error: (err) => console.error('❌ Error loading materials', err)
    });
  }

  /** 🔹 Show suppliers for a given material */
  viewSuppliers(materialId: number): void {
    this.orderService.getSuppliersByMaterial(materialId).subscribe({
      next: (suppliers: Suppliers[]) => {
        if (suppliers.length === 1) {
          // ✅ One supplier → go directly to create order
          this.router.navigate(
            ['/procurement/create-order', suppliers[0].suppliersId],
            { queryParams: { materialId } }
          );
        } else {
          // ✅ Multiple suppliers → show selection page
          this.router.navigate(['/procurement/suppliers-list'], {
            queryParams: { materialId }
          });
        }
      },
      error: (err) => console.error('❌ Error fetching suppliers by material', err)
    });
  }

  /** 🔹 Direct order from supplier card */
  orderFromSupplier(supplier: Suppliers): void {
    this.router.navigate(['/procurement/create-order', supplier.suppliersId]);
  }

  /** 🔹 Filter suppliers or materials by search query */
  filterData(): void {
    const query = this.searchQuery.toLowerCase().trim();

    if (this.tab === 'suppliers') {
      this.filteredSuppliers = this.suppliers.filter(
        (s) =>
          s.suppliersName.toLowerCase().includes(query) ||
          s.suppliersContactPerson.toLowerCase().includes(query)
      );
    } else {
      this.filteredMaterials = this.materials.filter((m) =>
        m.rwName.toLowerCase().includes(query)
      );
    }
  }
}
