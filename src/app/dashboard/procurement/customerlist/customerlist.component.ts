import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-customerlist',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, NgClass,RouterModule],
  templateUrl: './customerlist.component.html',
  styleUrls: ['./customerlist.component.css']  // ✅ FIXED: styleUrls instead of styleUrl
})
export class CustomerlistComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  pagedCustomers: Customer[] = [];
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
 
  constructor(private customerService: CustomerService, private router:Router) {}
 
  ngOnInit(): void {
    this.fetchCustomers();
  }
 
  fetchCustomers(): void {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.updatePagedCustomers();
      },
      error: (err) => {
        console.error('Error fetching customers', err);
      }
    });
  }
 
  filterCustomers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagedCustomers();
  }
 
  updatePagedCustomers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedCustomers = this.filteredCustomers.slice(start, end);
  }
 
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedCustomers();
    }
  }
 
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagedCustomers();
    }
  }
 
  getTotalPages(): number {
    return Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
  }
 
  addNewCustomer(){
    this.router.navigate(['/procurement/customerList/customer'])
  }
 
}
 
 