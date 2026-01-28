import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { InactivityService } from '../services/inactivity.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submitted = false;
  loginError = '';

  captchaText: string = '';
  userCaptcha: string = '';

  // Store error messages for fields
  emailError: string = '';
  passwordError: string = '';

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.email]],   // ✅ Email validation
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private inactivityService: InactivityService
  ) {
    this.generateCaptcha();

    // Watch for changes and auto-update error messages
    this.loginForm.get('username')?.valueChanges.subscribe(() => this.validateEmail());
    this.loginForm.get('password')?.valueChanges.subscribe(() => this.validatePassword());
  }

  // Generate a random 6-character CAPTCHA
  generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.captchaText = '';
    for (let i = 0; i < 6; i++) {
      this.captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.userCaptcha = '';
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  // ✅ Email validation messages
  validateEmail() {
    const control = this.loginForm.get('username');
    if (control?.touched || control?.dirty) {
      if (control.hasError('required')) {
        this.emailError = 'Email is required';
      } else if (control.hasError('email')) {
        this.emailError = 'Please enter a valid email address';
      } else {
        this.emailError = '';
      }
    }
  }

  // ✅ Password validation messages
  validatePassword() {
    const control = this.loginForm.get('password');
    if (control?.touched || control?.dirty) {
      if (control.hasError('required')) {
        this.passwordError = 'Password is required';
      } else if (control.hasError('minlength')) {
        this.passwordError = 'Password must be at least 6 characters';
      } else {
        this.passwordError = '';
      }
    }
  }

  triggerShake(controlName: string) {
  const control = this.loginForm.get(controlName);
  if (control?.invalid && control?.touched) {
    const element = document.querySelector<HTMLInputElement>(`[formControlName="${controlName}"]`);
    if (element) {
      element.classList.remove('shake'); // reset animation
      void element.offsetWidth; // force reflow
      element.classList.add('shake'); // retrigger
    }
  }
}


  onSubmit() {
    console.log("Login button clicked!");
    this.submitted = true;

    // Run validations once before checking
    this.validateEmail();
    this.validatePassword();

    if (this.loginForm.invalid) {
      console.log("Form is invalid", this.loginForm.value);
      return;
    }

    if (this.userCaptcha !== this.captchaText) {
      this.loginError = 'CAPTCHA is incorrect!';
      this.generateCaptcha();
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log("Sending login request with:", username);

    this.userService.login(username!, password!).subscribe({
      next: (res) => {
        console.log("Login successful", res);

        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role);
        localStorage.setItem('username', res.username);
        localStorage.setItem('userId', res.userId);

        this.loginError = '';

        if (res.mustReset) {
          this.router.navigate(['/reset-password']);
          return;
        }

        this.inactivityService.startMonitoring();

        switch (res.role) {
          case 'ADMIN': this.router.navigate(['/admin/home']); break;
          case 'PROCUREMENT_OFFICER': this.router.navigate(['/procurement/home']); break;
          case 'PRODUCTION_MANAGER': this.router.navigate(['/production/home']); break;
          case 'INVENTORY_MANAGER': this.router.navigate(['/inventory/home']); break;
          default: this.router.navigate(['/login']); break;
        }
      },
      error: (err) => {
        console.log("Login failed", err);
        this.loginError = 'Login failed. Please try again.';

        if (err.status === 401 || err.status === 403) {
          if (err.error?.error) this.loginError = err.error.error;
          if (err.error?.accountLocked) {
            this.loginError = 'Your account has been locked due to multiple failed login attempts. Please contact support.';
          }
        }
      }
    });
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
