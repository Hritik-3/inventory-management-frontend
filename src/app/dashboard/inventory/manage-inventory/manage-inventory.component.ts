import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-manage-inventory',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,     // ✅ required for <mat-card>
    MatButtonModule    // ✅ required for <button mat-raised-button>
  ],
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.css']
})
export class ManageInventoryComponent {
 
  constructor(private router: Router) {}
 
  goToAddCategory() {
    this.router.navigate(['/inventory/manage-inventory/add-category']);
  }
 
  goToAddProduct() {
    this.router.navigate(['/inventory/manage-inventory/add-product']);
  }
}
 
 