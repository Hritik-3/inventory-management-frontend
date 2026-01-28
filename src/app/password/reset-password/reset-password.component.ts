import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  resetData = {
    currentPassword: '',
    newPassword: ''
  };
  message = '';
  passwordCriteria: any = {};

  constructor(
    private userService: UserService,
    private router: Router,
    public passwordService: PasswordService
  ) {}
touched=false;

 validatePassword() {
  this.passwordCriteria = this.passwordService.validatePassword(this.resetData.newPassword);
}

isPasswordValid(): boolean {
  const criteria = this.passwordCriteria;
  return criteria.minLength && criteria.uppercase && criteria.lowercase && criteria.number && criteria.specialChar;
}


  resetPassword(): void {
    if (!this.isPasswordValid()) {
      this.message = 'Please ensure your password meets all the requirements.';
      return;
    }

    this.userService.resetPassword(
      this.resetData.currentPassword,
      this.resetData.newPassword
    ).subscribe({
      next: res => {
        this.message = res + ' Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: err => {
        console.error('Reset password error:', err);
        this.message = err.error || 'Password reset failed.';
      }
    });
  }
}
