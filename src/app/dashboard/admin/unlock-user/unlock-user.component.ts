import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-unlock-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './unlock-user.component.html'
})
export class UnlockUserComponent {
  searchControl = new FormControl('');
  results: any[] = [];
  loading = false;
  error: string = '';

  constructor(private http: HttpClient, private userService: UserService) {}

  search() {
    const query = this.searchControl.value?.trim();
    if (!query) {
      this.error = 'Please enter search text.';
      return;
    }
    this.error = '';
    this.loading = true;
    this.http
      .get<any[]>(`http://localhost:8086/api/users/search?query=${encodeURIComponent(query)}`)
      .subscribe({
        next: (res) => {
          this.results = res;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Failed to load users.';
          this.loading = false;
        }
      });
  }

  unlock(email: string) {
    if (!confirm(`Unlock account for ${email}?`)) {
      return;
    }
    this.http
      .put(`http://localhost:8086/api/users/unlock-account?email=${encodeURIComponent(email)}`, {})
      .subscribe({
        next: () => {
          alert('Account unlocked!');
          this.search(); // refresh
        },
        error: (err) => {
          console.error(err);
          alert('Failed to unlock account.');
        }
      });
  }
}
