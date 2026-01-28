import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // ✅ Import RouterOutlet
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReportComponent } from './dashboard/inventory/report/report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule, ReportComponent], // ✅ Add RouterOutlet here
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title="Hello"
  currentYear = new Date().getFullYear(); // ✅ Fix for the 2nd error
}
