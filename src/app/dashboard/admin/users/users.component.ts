import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InactivityService } from '../../../services/inactivity.service';
import { UserService } from '../../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormsModule } from '@angular/forms';
import { Users } from '../../../models/users';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{


  users: Users[] = [];
    filteredUsers: Users[] = [];
    pagedUsers: Users[] = [];
  
    currentPage: number = 1;
    itemsPerPage: number = 5;
    searchQuery: string = '';
    showUsersTable: boolean = false;
    sortField: string = '';
    sortAscending: boolean = true;
  
    error: string = '';
    loading = false;
    searchControl = new FormControl('');
      results: any[] = [];
      searchEmail = '';
    selectedUser: any = null;
    viewsuppliers=false;

    selectedRole: any; // This will hold the selected full role object

  

   constructor( private router: Router, private inactivityService: InactivityService,private userService:UserService,private http:HttpClient) {}

  ngOnInit(): void {
    this.getallUsers();
  }
  deactivateUser(email: string) {
  if (!confirm(`Are you sure you want to deactivate account for ${email}?`)) {
    return;
  }

  this.http
    .put<{ message: string }>(
      `http://localhost:8086/api/users/deactivate-account?email=${encodeURIComponent(email)}`,
      {}
    )
    .subscribe({
      next: (res) => {
        alert(res.message);
        this.getallUsers(); // Refresh user list
      },
      error: (err) => {
        console.error(err);
        alert('Failed to deactivate user.');
      }
    });
  }


  getallUsers(): void {
    this.userService.getAllUsers().subscribe((data: Users[]) => {
      this.users = data;
      this.filteredUsers = data;
      this.updatePagedUsers();
     
    });
  }

  

  

  filterUsers(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.userName.toLowerCase().includes(query) ||
      user.userEmail.toLowerCase().includes(query)
    );
    this.currentPage = 1;
    this.updatePagedUsers();
  }

  sortUsers(field: string): void {
    if (this.sortField === field) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortField = field;
      this.sortAscending = true;
    }

    this.filteredUsers.sort((a: any, b: any) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return this.sortAscending ? -1 : 1;
      if (valA > valB) return this.sortAscending ? 1 : -1;
      return 0;
    });

    this.updatePagedUsers();
  }

  updatePagedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedUsers = this.filteredUsers.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePagedUsers();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  


  searchUser() {
  if (!this.searchEmail.trim()) {
    alert('Please enter an email');
    return;
  }

  this.http.get<any>(`http://localhost:8086/api/users/email/${encodeURIComponent(this.searchEmail.trim())}`).subscribe({
    next: (res) => {
      this.selectedUser = res;
      this.selectedRole = res.role; // set the dropdown to current role
    },
    error: (err) => {
      console.error(err);
      alert('User not found');
      this.selectedUser = null;
    }
  });
}



unlock(email: string) {
  if (!confirm(`Unlock account for ${email}?`)) {
    return;
  }
  this.http
    .put<{ message: string }>(`http://localhost:8086/api/users/unlock-account?email=${encodeURIComponent(email)}`, {})
    .subscribe({
      next: (res) => {
        alert(res.message); // show the backend message
        this.getallUsers(); // refresh
      },
      error: (err) => {
        console.error(err);
        alert('Failed to unlock account.');
      }
    });
  }


 lockuser(email: string) {
  if (!confirm(`Lock account for ${email}?`)) {
    return;
  }
  this.http
    .put<{ message: string }>(`http://localhost:8086/api/users/lock-account?email=${encodeURIComponent(email)}`, {})
    .subscribe({
      next: (res) => {
        alert(res.message); // show the backend message
        this.getallUsers(); // refresh
      },
      error: (err) => {
        console.error(err);
        alert('Failed to lock account.');
      }
    });
  }


}
