import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Role } from '../../../models/users';
import { UserService } from '../../../services/user.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  roles: Role[] = [];

  constructor(private fb: FormBuilder, private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
   this.registerForm = this.fb.group({
  userId: [''],
  userPassword: [''],
  userName: ['', [
    Validators.required,
    Validators.pattern(/^[A-Za-z\s]+$/)  // only letters and spaces
  ]],
  userFullName: ['', [
    Validators.required,
    Validators.pattern(/^[A-Za-z\s]+$/)  // only letters and spaces
  ]],
  userMobile: ['', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/)
  ]],
  userEmail: ['', [
    Validators.required,
    Validators.email
  ]],
  userProfileImg: [''],
  role: this.fb.group({
    roleId: [''],
    roleName: ['', Validators.required],
  }),
  address: this.fb.group({
    addressId: [''],
    addressStreet: [''],
    addressCity: [''],
    addressState: [''],
    addressPostalCode: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]],
    addressCountry: ['']
  })
});



    

    // Listen for PIN code changes and trigger location autofill
    this.registerForm.get('address.addressPostalCode')?.valueChanges.subscribe(pincode => {
      if (/^[0-9]{6}$/.test(pincode)) {
        this.fetchAddressFromPincode(pincode);
      }
    });


    this.userService.getRoles().subscribe({
      next: (data: Role[]) => {
        console.log('Roles loaded:', data);
        this.roles = data;
      },
      error: err => {
        console.error('Failed to load roles:', err);
      }
    });
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedRole = target.value;
    const role = this.roles.find(r => r.roleName === selectedRole);
    if (role) {
      this.registerForm.get('role')?.patchValue({
        roleId: role.roleId,
        roleName: role.roleName
      });
    }
  }

  fetchAddressFromPincode(pincode: string): void {
  this.http.get<any[]>(`https://api.postalpincode.in/pincode/${pincode}`).subscribe({
    next: (response: any[]) => {  // ✅ typed `response`
      if (response[0].Status === 'Success' && response[0].PostOffice?.length) {
        const postOffice = response[0].PostOffice[0];
        this.registerForm.get('address')?.patchValue({
          addressCity: postOffice.District || '',
          addressState: postOffice.State || '',
          addressCountry: postOffice.Country || 'India'
        });
      }
    },
    error: (err: any) => {  // ✅ typed `err`
      console.error('Error fetching pincode details:', err);
    }
  });
}


  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.warn('Form is invalid');
      return;
    }

    this.userService.registeruser(this.registerForm.value).subscribe({
      next: createdUser => {
        alert('User registered successfully!');
        console.log('User registered successfully:', createdUser);
      },
      error: err => {
        console.error('Error registering user:', err);
      }
    });
  }
}
