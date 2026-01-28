import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProductionManagerScheduleService } from '../../../services/production-manager-schedule.service';
import { TimelineEvent, UnitLineStatus } from '../../../models/production-schedule';

interface LineStatus {
  lineName: string;
  status: string;
}

interface UnitWithLines {
  unitName: string;
  status: string;
  lines: LineStatus[];
}

@Component({
  selector: 'app-production-schedule-timeline',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './production-schedule-timeline.component.html',
  styleUrls: ['./production-schedule-timeline.component.css']
})
export class ProductionScheduleTimelineComponent implements OnInit {

  scheduleId!: number;
  timeline: TimelineEvent[] = [];
  unitsStatus: UnitWithLines[] = [];

  message: string = '';
  loading: boolean = false;
  loadingUnits: boolean = false;

  constructor(private psService: ProductionManagerScheduleService) {}

  ngOnInit(): void {
    this.fetchUnitsStatus(); // fetch units & lines on component init
  }

  fetchUnitsStatus() {
    this.loadingUnits = true;
    this.psService.getUnitsStatus().subscribe({
      next: (res: UnitLineStatus[]) => {
        // Group lines by unit
        const grouped: { [key: string]: UnitWithLines } = {};

        res.forEach(line => {
          const unitName = line.unitName.trim();
          const lineStatus = line.status.replace('\r', ''); // clean carriage return

          if (!grouped[unitName]) {
            grouped[unitName] = {
              unitName,
              status: lineStatus, // initially take first line status
              lines: []
            };
          }

          grouped[unitName].lines.push({
            lineName: line.lineName.trim(),
            status: lineStatus
          });

          // Update unit status: AVAILABLE if all lines available, PARTIALLY OCCUPIED if some RUNNING
          const unitLines = grouped[unitName].lines;
          if (unitLines.every(l => l.status === 'AVAILABLE')) {
            grouped[unitName].status = 'AVAILABLE';
          } else if (unitLines.some(l => l.status === 'RUNNING')) {
            grouped[unitName].status = 'PARTIALLY OCCUPIED';
          } else {
            grouped[unitName].status = 'UNAVAILABLE';
          }
        });

        this.unitsStatus = Object.values(grouped);
        this.loadingUnits = false;
      },
      error: (err) => {
        console.error('Error fetching units status:', err);
        this.loadingUnits = false;
      }
    });
  }

fetchTimeline() {
  if (!this.scheduleId) {
    this.message = 'Please enter a schedule ID.';
    return;
  }

  this.loading = true;
  this.message = '';
  this.timeline = [];

  this.psService.getTimeline(this.scheduleId).subscribe({
    next: (res: TimelineEvent[]) => {
      if (res && res.length > 0) {
        this.timeline = res;
      } else {
        this.message = 'No timeline available for this schedule.';
      }
      this.loading = false;
    },
    error: (err) => {
      console.error('Error fetching timeline:', err);
      if (err.status === 404) {
        this.message = `❌ Schedule ID ${this.scheduleId} not found.`;
      } else {
        this.message = `❌ Error fetching timeline: ${err.message || err.statusText}`;
      }
      this.loading = false;
    }
  });
}

}
