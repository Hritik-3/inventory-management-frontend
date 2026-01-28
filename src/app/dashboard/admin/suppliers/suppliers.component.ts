import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Suppliers } from '../../../models/supplier';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './suppliers.component.html',
  styleUrl: './suppliers.component.css'
})

export class SuppliersComponent implements OnInit{
 
 
   suppliers: Suppliers[] = [];
 
constructor(private userService:UserService,private http:HttpClient){}
 
ngOnInit(): void {
    this.fetchSuppliers();
}
 
 fetchSuppliers() {
    this.http.get<Suppliers[]>('http://localhost:8086/api/users/getSupplier')
      .subscribe({
        next: (data) => {
          this.suppliers = data;
         
        },
        error: (err) => {
          console.error('Error fetching suppliers:', err);
        }
      });
  }
}