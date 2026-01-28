import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductionScheduleService } from '../../../services/production-schedule.service';

@Component({
  selector: 'app-schedule-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {
  schedules: any[] = [];
  filteredSchedules: any[] = [];
  categories: string[] = [];
  selectedCategory: string = 'all';
  loading = true;

  constructor(private scheduleService: ProductionScheduleService) {}

  ngOnInit(): void {
    this.loadSchedules();
  }

  loadSchedules(): void {
    this.scheduleService.getAllSchedules().subscribe({
      next: (data) => {
        this.schedules = data;

        // Extract unique categories
        this.categories = [...new Set(
          this.schedules
            .map((s: any) => s.product?.category?.categoryName)
            .filter((c: string | undefined) => !!c)
        )];

        // Apply latest-first sorting
        this.filteredSchedules = this.getSortedSchedules(this.schedules);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching schedules', err);
        this.loading = false;
      }
    });
  }

  // Filter by category & sort latest first
  filterByCategory(): void {
    let filtered = this.selectedCategory === 'all'
      ? [...this.schedules]
      : this.schedules.filter(
          (s: any) => s.product?.category?.categoryName === this.selectedCategory
        );

    this.filteredSchedules = this.getSortedSchedules(filtered);
  }

  // Sort schedules by start date descending (latest first)
  private getSortedSchedules(schedules: any[]): any[] {
    return schedules.sort((a, b) => {
      return new Date(b.psStartDate).getTime() - new Date(a.psStartDate).getTime();
    });
  }
}
