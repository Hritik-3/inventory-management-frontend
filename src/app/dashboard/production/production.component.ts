import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InactivityService } from '../../services/inactivity.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-production-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './production.component.html',
  styleUrls: ['./production.component.css']
})
export class ProductionComponent implements OnInit {

  constructor(
    private router: Router,
    private inactivityService: InactivityService,
    private userService: UserService
  ) {}

  username: string | null = '';
  profileMenuOpen = false;

  ngOnInit(): void {
  this.username = localStorage.getItem('username');
  if (typeof window !== 'undefined') {
    window.addEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }
}

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
    }
  }
  goHome() {
    this.router.navigate(['/dashboard/production'])
  }

  updatePassword() {
    this.router.navigate(['/production/reset-password']);
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
    this.router.navigate(['/production/update-profile']); // or open a modal
  }

  logoutFromMenu(event: Event): void {
    event.stopPropagation();
    this.logout(); // reuse existing logout method
  }
  goToSchedule(): void{
    this.router.navigate(['/production/production-manager-schedule']);
  }

  onHomeClick(){
     this.router.navigate(['/production/home'])
  }
  goScheduleTracking(){
    this.router.navigate(['/production/tracking-schedules']);
  }

  goScheduleTimeline(){
    this.router.navigate(['/production/timeline-schedules'])
  }

  closeProfileMenuOnOutsideClick(event: any): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.profileMenuOpen = false;
    }
  }

}
