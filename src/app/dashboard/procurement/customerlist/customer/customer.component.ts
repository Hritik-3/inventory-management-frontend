import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../services/customer.service';
import { Customer } from '../../../../models/customer';
 
 
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
 
  customerForm!: FormGroup;
 
  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private router: Router
  ) {}
 
  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      // customerId: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['']
    });
  }
 
  onSubmit(): void {
    if (this.customerForm.valid) {
      const customer: Customer = {
        id: 0, // backend will auto-generate it
        // id: this.customerForm.value.customerId,
        name: this.customerForm.value.name,
        email: this.customerForm.value.email,
        phone: this.customerForm.value.phone,
        address: this.customerForm.value.address,
        isActive: true
      };
 
      this.customerService.createCustomer(customer).subscribe({
        next: () => {
          alert('✅ Customer added successfully!');
          this.customerForm.reset();
          this.router.navigate(['/procurement/customerList']); // redirect after success
        },
 
        error: (error) => {
          console.error('❌ Error adding customer:', error);
          alert('Failed to add customer. Please try again.');
        }
      });
    } else {
      this.customerForm.markAllAsTouched(); // highlight errors
    }
  }
}
 
 