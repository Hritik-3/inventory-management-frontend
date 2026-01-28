import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ScheduleTracking } from '../../../models/production-schedule';
import { ProductionManagerScheduleService } from '../../../services/production-manager-schedule.service';

@Component({
  selector: 'app-production-schedule-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './production-schedule-tracking.component.html',
  styleUrls: ['./production-schedule-tracking.component.css']
})
export class ProductionScheduleTrackingComponent {

  scheduleId!: number;
  trackingInfo: ScheduleTracking | null = null;
  message: string = '';

  constructor(private psService: ProductionManagerScheduleService) {}

  // Fetch tracking info
  trackSchedule() {
    if (!this.scheduleId) {
      this.message = 'Please enter a schedule ID';
      return;
    }

    this.psService.trackSchedule(this.scheduleId).subscribe({
      next: (res) => {
        this.trackingInfo = res;
        this.message = '';
      },
      error: (err) => {
        this.message = '❌ Error fetching tracking info: ' + err.message;
        this.trackingInfo = null;
      }
    });
  }
}
