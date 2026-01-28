import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { InactivityService } from '../../services/inactivity.service';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LowStockAlertService } from '../../services/low-stock-alert.service';

import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType } from 'chart.js';
import { LowStockAlert } from '../../models/LowStockAlert';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgChartsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private inactivityService: InactivityService,
    private userService: UserService,
    private alertService: LowStockAlertService
  ) {}

  username: string | null = '';
  profileMenuOpen = false;

  // 🔔 Notifications
  notificationsOpen = false;
  alerts: LowStockAlert[] = [];
  unreadCount: number = 0;

  // 📊 Chart properties
  stockData: { name: string; value: number }[] = [];
  public stockLevelChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }]
  };
  public chartType: ChartType = 'doughnut';

  // 📦 Inventory submenu
  inventoryMenuOpen = false;

  ngOnInit() {
    this.username = localStorage.getItem('username');
    window.addEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));

    this.loadAlerts();
    setInterval(() => this.loadAlerts(), 15000);
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.closeProfileMenuOnOutsideClick.bind(this));
  }

  // 🔔 Alerts
  loadAlerts(): void {
    this.alertService.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data.filter(a => a.status === 'NEW');
        this.unreadCount = this.alerts.length;
      },
      error: (err) => console.error('Error fetching alerts', err)
    });
  }

  onNotificationClick(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }


  acknowledgeAlert(id: number, event: Event): void {
    event.stopPropagation();
    this.alertService.acknowledgeAlert(id).subscribe({
      next: () => this.loadAlerts(),
      error: (err) => console.error('Error acknowledging alert', err)
    });
  }

  // 🏠 Navigation
  onHomeClick() { this.router.navigate(['/inventory/home']); }
  // goHome() { this.router.navigate(['/inventory/home']); }
  stock() { this.router.navigate(['/inventory/stock']); }
  goToReport() { this.router.navigate(['/inventory/report']); }
  goToAlerts() { this.router.navigate(['/inventory/alert']); }
  trackOrders() { this.router.navigate(['/inventory/trackorder']); }
  goToStockView() { this.router.navigate(['/inventory/stockview']); }
  goToScheduleTracking() { this.router.navigate(['/inventory/schedule-tracking']); }
  goToSchedules() { this.router.navigate(['/inventory/allschedules']); }

  goToAddCatProd() {
    this.inventoryMenuOpen = !this.inventoryMenuOpen;
  }

  // 🔑 Account actions
  updatePassword() { this.router.navigate(['/inventory/reset-password']); }
  logout() { this.inactivityService.logout(); }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  updateProfile(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/inventory/update-profile']);
  }

  logoutFromMenu(event: Event): void {
    event.stopPropagation();
    this.logout();
  }

  // 📌 Close dropdowns if clicked outside
  closeProfileMenuOnOutsideClick(event: any): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-container')) {
      this.profileMenuOpen = false;
    }
    if (!target.closest('.notification-container')) {
      this.notificationsOpen = false;
    }
  }

  // ✅ Generic navigation helper (from first file)
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  manageInventory(): void {
    this.router.navigate(['/inventory/manage-inventory']);
  }

  goToProcurementOrder(){
    this.router.navigate(['/inventory/procurement-orders-requests'])
  }

 
}
