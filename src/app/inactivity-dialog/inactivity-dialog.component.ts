import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-inactivity-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './inactivity-dialog.component.html',
  styleUrls: ['./inactivity-dialog.component.css']
})
export class InactivityDialogComponent {
  countdown: number;

  constructor(
    private dialogRef: MatDialogRef<InactivityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { countdown: number }
  ) {
    this.countdown = data.countdown;
    this.startCountdown();
  }

  private startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.dialogRef.close('logout');
      }
    }, 1000);
  }

  stayLoggedIn() {
    this.dialogRef.close('stay');
  }
}
