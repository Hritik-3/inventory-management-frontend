import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { PasswordService } from '../../services/password.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotPasswordComponent {
  email = '';
  otp = '';
  newPassword = '';
  message = '';
  otpSent = false;
  otpVerified = false;

  passwordCriteria: any = {};
  touched = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    public passwordService: PasswordService
  ) {}

  sendOtp() {
    this.userService.sendOtp(this.email).subscribe({
      next: res => {
        this.message = '✅ OTP sent to your email.';
        this.otpSent = true;
      },
      error: err => {
        this.message = '❌ Failed to send OTP.';
      }
    });
  }

  verifyOtp() {
    this.userService.verifyOtp(this.email, this.otp).subscribe({
      next: res => {
        this.message = '✅ OTP verified. Please set your new password.';
        this.otpVerified = true;
      },
      error: err => {
        this.message = '❌ Invalid OTP.';
      }
    });
  }

  validatePassword() {
    this.passwordCriteria = this.passwordService.validatePassword(this.newPassword);
  }

  isPasswordValid(): boolean {
    const c = this.passwordCriteria;
    return c?.minLength && c.uppercase && c.lowercase && c.number && c.specialChar;
  }

  resetPassword() {
    if (!this.isPasswordValid()) {
      this.message = 'Please ensure your password meets all the requirements.';
      return;
    }

    this.userService.resetPasswordWithOtp(this.email, this.otp, this.newPassword).subscribe({
      next: (res: any) => {
        this.message = res.message+ ' Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 5000);
      },
      error: err => {
        this.message = err.error?.message || 'Failed to reset password.';
      }
    });
  }
}
