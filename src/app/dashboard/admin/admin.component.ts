import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InactivityService } from '../../services/inactivity.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,ReactiveFormsModule],
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {

  selectedRole: any;
  roleupdate: boolean = false;
  username: string | null = '';
  profileMenuOpen = false;

  constructor(
    private router: Router,
    private inactivityService: InactivityService,
    private userService: UserService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    window.addEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }

  onHomeClick(){
     this.router.navigate(['/admin/home'])
  }

  users() {
    this.router.navigate(['/admin/users']);
  }

  register() {
    this.router.navigate(['/admin/register']);
  }

  unlockuser() {
    this.router.navigate(['/admin/unlockuser']);
  }

  updatepassword() {
    this.router.navigate(['/admin/reset-password']);
  }

  fetchSuppliers() {
    this.router.navigate(['/admin/suppliers']);
  }

  logout() {
    this.inactivityService.logout();
  }

  onNotificationClick(): void {
    this.router.navigate(['/notifications']);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  updateProfile(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/admin/update-profile']); // or open a modal
  }

  logoutFromMenu(event: Event): void {
    event.stopPropagation();
    this.logout(); // reuse existing logout method
  }

  closeProfileMenuOnOutsideClick(event: any): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.profileMenuOpen = false;
    }
  }
}
