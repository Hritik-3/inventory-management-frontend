// procurement.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InactivityService } from '../../services/inactivity.service';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-procurement-dashboard',
  standalone:true,
  imports: [
    CommonModule,
    FormsModule,     // ✅ <-- THIS LINE IS IMPORTANT
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './procurement.component.html',
  styleUrls: ['./procurement.component.css']
})
export class ProcurementComponent implements OnInit {
 constructor( private router: Router, private inactivityService: InactivityService,private userService:UserService,private orderservice:OrderService) {}


  username: string | null = '';
  profileMenuOpen = false;

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    window.addEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }

  onHomeClick(){
    this.router.navigate(['/procurement/home'])
  }
  
  customer(){
    this.router.navigate(['/procurement/customer'])
  }

  customerList(){
    this.router.navigate(['/procurement/customerList'])
  }


  updatePassword(){
    this.router.navigate(['/procurement/reset-password'])
  }

  orderProducts(){
    this.router.navigate(['/procurement/order-product'])
  }

  orderRawMaterial(){
    this.router.navigate(['/procurement/order-rawMaterial'])
  }

  suppliermanagement(){
    this.router.navigate(["/procurement/update-supplier"])
  }

  payment(){
    this.router.navigate(['/procurement/payment'])
  }

  orderHistory(){
    this.router.navigate(['/procurement/view-order'])
  }

  trackorder(){
    this.router.navigate(['/procurement/track-order'])
  }

 viewreturn(){
  this.router.navigate(['/procurement/view-return'])
 }

  logout(){
    this.inactivityService.logout();
  }


  onNotificationClick(): void {
    this.router.navigate(['/procurement/home']);
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  updateProfile(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/procurement/update-profile']); // or open a modal
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
 
