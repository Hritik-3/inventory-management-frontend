import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User, UserService } from '../services/user.service';
 
@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId!: string;    // from localStorage (string)
  loading = true;
  fetchedUser?: User; // keep original user if needed
 
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}
 
  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || '';
 
    // Build form. addressId added as disabled control because Address requires addressId.
    this.profileForm = this.fb.group({
      userId: [{ value: '', disabled: true }],
      role: [{ value: '', disabled: true }],
      userName: [{ value: '', disabled: true }],
      userFullName: [{ value: '', disabled: true }],
      userEmail: [{ value: '', disabled: true }],
      userMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      userProfileImg: [{ value: '', disabled: true }],
      addressId: [{ value: null, disabled: true }], // required by your Address type
      addressStreet: [''],
      addressCity: [''],
      addressState: [''],
      addressPostalCode: [''],
      addressCountry: ['']
    });
 
    if (!this.userId) {
      console.warn('No userId found in localStorage');
      this.loading = false;
      return;
    }
 
    // Fetch user details using your service (GET => `${baseUrl}/users/${userId}`)
    this.userService.getUserById(this.userId).subscribe({
      next: (user: User) => {
        this.fetchedUser = user;
 
        // patch disabled and enabled controls so values show
        this.profileForm.patchValue({
          userId: user.userId?.toString() ?? '',
          role: user.role?.roleName ?? '',
          userName: user.userName ?? '',
          userFullName: user.userFullName ?? '',
          userEmail: user.userEmail ?? '',
          userMobile: user.userMobile ?? '',
          userProfileImg: user.userProfileImg ?? '',
          addressId: user.address?.addressId ?? null,
          addressStreet: user.address?.addressStreet ?? '',
          addressCity: user.address?.addressCity ?? '',
          addressState: user.address?.addressState ?? '',
          addressPostalCode: user.address?.addressPostalCode ?? '',
          addressCountry: user.address?.addressCountry ?? ''
        });
 
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile', err);
        this.loading = false;
      }
    });
  }
 
onSubmit(): void {

  if (this.profileForm.invalid) {

    this.profileForm.markAllAsTouched();

    return;

  }
 
  const updatedData: any = {

    userMobile: this.profileForm.get('userMobile')?.value,

    address: {

      addressId: this.profileForm.get('addressId')?.value,

      addressStreet: this.profileForm.get('addressStreet')?.value,

      addressCity: this.profileForm.get('addressCity')?.value,

      addressState: this.profileForm.get('addressState')?.value,

      addressPostalCode: this.profileForm.get('addressPostalCode')?.value,

      addressCountry: this.profileForm.get('addressCountry')?.value

    }

  };
 
  this.userService.updateUserProfile(this.userId, updatedData).subscribe({

    next: () => {

      alert('✅ Profile updated successfully');
 
      const role = localStorage.getItem('role');
 
      switch (role?.toUpperCase()) {

        case 'ADMIN':

          this.router.navigate(['/admin/home']);

          break;
 
        case 'PROCUREMENT_OFFICER':

        case 'PROCUREMENT':

          this.router.navigate(['/procurement/home']);

          break;
 
        case 'INVENTORY_MANAGER':

        case 'INVENTORY':

          this.router.navigate(['/inventory/home']);

          break;
 
        case 'PRODUCTION_MANAGER':

          this.router.navigate(['/production/home']);

          break;
 
        default:

          this.router.navigate(['/login']);

      }

    },

    error: (err) => {

      console.error('❌ Update failed', err);

      alert('❌ Failed to update profile');

    }

  });

}

 
 
cancel(): void {
  const currentUrl = this.router.url || '';
  const role = (localStorage.getItem('role') || '').toUpperCase().trim();

  // URL-based shortcuts (explicitly handle production)
  if (currentUrl.includes('/inventory')) {
    this.router.navigate(['/inventory/home']);
    return;
  }
  if (currentUrl.includes('/procurement')) {
    this.router.navigate(['/procurement/home']);
    return;
  }
  if (currentUrl.includes('/admin')) {
    this.router.navigate(['/admin/home']);
    return;
  }
  if (currentUrl.includes('/production')) {
    this.router.navigate(['/production/home']);
    return;
  }

  // Role-based fallback navigation
  switch (role) {
    case 'INVENTORY':
    case 'INVENTORY_MANAGER':
      this.router.navigate(['/inventory/home']);
      return;

    case 'PROCUREMENT':
    case 'PROCUREMENT_OFFICER':
      this.router.navigate(['/procurement/home']);
      return;

    case 'ADMIN':
      this.router.navigate(['/admin/home']);
      return;

    case 'PRODUCTION':
    case 'PRODUCTION_MANAGER':
      this.router.navigate(['/production/home']);
      return;

    default:
      this.router.navigate(['/login']);
      return;
  }
}



  
}

 
 