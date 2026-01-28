import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { InactivityDialogComponent } from '../inactivity-dialog/inactivity-dialog.component';

@Injectable({ providedIn: 'root' })
export class InactivityService {
  private timeoutInMs = 15 * 60 * 1000; // 15 minutes
  private timer: any;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private dialog: MatDialog
  ) {}

  startMonitoring() {
    this.resetTimer();

    window.addEventListener('mousemove', this.resetTimer);
    window.addEventListener('keydown', this.resetTimer);
    window.addEventListener('click', this.resetTimer);
  }

  stopMonitoring() {
    clearTimeout(this.timer);
    window.removeEventListener('mousemove', this.resetTimer);
    window.removeEventListener('keydown', this.resetTimer);
    window.removeEventListener('click', this.resetTimer);
  }

  private resetTimer = () => {
    clearTimeout(this.timer);

    this.ngZone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.ngZone.run(() => this.showInactivityDialog());
      }, this.timeoutInMs);
    });
  };

  private showInactivityDialog() {
    const dialogRef = this.dialog.open(InactivityDialogComponent, {
      width: '350px',
      data: { countdown: 30 },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'stay') {
        this.resetTimer();
      } else {
        this.logout();
      }
    });
  }

  


  logout(): void {
  // Remove everything related to session
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.clear();
  // Optionally clear ALL localStorage if you prefer
  // localStorage.clear();

  // Stop inactivity monitoring
  this.stopMonitoring();

  // Navigate back to login page
  // this.router.navigate(['/login']);


  this.router.navigate(['/login']).then(() => {
  window.history.pushState(null, '', window.location.href);
  window.onpopstate = () => {
    window.history.go(1);
  };
});

}

}
