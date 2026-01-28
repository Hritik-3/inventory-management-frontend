// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Role, Users } from '../models/users';
import { InactivityService } from './inactivity.service';
import { Router } from '@angular/router';
import { Suppliers } from '../models/supplier';

export interface User {
  userId: number;
  userName: string;
  userFullName: string;
  userEmail: string;
  userMobile: string;
  userProfileImg: string;
  role: {
    roleId: number;
    roleName: string;
  };
  address: {
    addressId: number;
    addressStreet: string;
    addressCity: string;
    addressState: string;
    addressPostalCode: string;
    addressCountry: string;
  };

}



@Injectable({ providedIn: 'root' })
export class UserService {



  policy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    expiryDays: 90
  };
  suppliers: Suppliers[] =[];

  validatePassword(password: string): any {
    return {
      minLength: password.length >= this.policy.minLength,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#\$%\^\&*\)\(+=._-]+/.test(password)
    };
  }
  private baseUrl = 'http://localhost:8086/api/users';

  private url='http://localhost:8086/api/users/register';

  constructor(private http: HttpClient,private inactivityService:InactivityService,private router:Router) {}

  // getUserById(id: number): Observable<Users> {
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  //   return this.http.get<Users>(`${this.baseUrl}/${id}`, { headers });
  // }


  registeruser(user: Users): Observable<Users> {
  return this.http.post<Users>(this.url, user).pipe(
    catchError(error => {
      console.error('Error registering user:', error);
      return throwError(() => error);
    })
  );
}

 
  

 login(username: string, password: string): Observable<{ token: string,username:string, role: string, mustReset: boolean, userId: string }> {
  return this.http.post<{ token: string,username:string, role: string, mustReset: boolean,userId: string}>('http://localhost:8086/auth/login', {
    username,
    password
  });
 }

getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>('http://localhost:8086/api/users/roles');
  }

  // Get all users with pagination and optional search
getAllUsers(): Observable<Users[]> {
  return this.http.get<Users[]>('http://localhost:8086/api/users/getallusers');
}


 // Toggle account status
  toggleAccountStatus(userId: string, isLocked: boolean): Observable<any> {
    const action = isLocked ? 'unlock' : 'lock-account';
    const url = `${this.baseUrl}/${action}/${userId}`;
    return this.http.put(url, {});
  }


forgotPassword(email: string): Observable<string> {
    return this.http.post('http://localhost:8086/api/users/forgot-password', null, {
      params: { email },
      responseType: 'text'
    });
  }

  resetPassword(currentPassword: string, newPassword: string): Observable<string> {
    return this.http.put(
      'http://localhost:8086/api/users/reset-password',
      {
        currentPassword,
        newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseType: 'text'
      }
    );
  }

//get location by pincode
  getLocationByPincode(pincode: string) {
  return this.http.get<any[]>(`https://api.postalpincode.in/pincode/${pincode}`);
  }



  sendOtp(email: string): Observable<string> {
    return this.http.post(this.baseUrl + '/send-otp', { email }, { responseType: 'text' });
  }

  verifyOtp(email: string, otp: string): Observable<string> {
    return this.http.post(this.baseUrl + '/verify-otp', { email, otp }, { responseType: 'text' });
  }

 resetPasswordWithOtp(email: string, otp: string, newPassword: string): Observable<string> {
  return this.http.post<string>('http://localhost:8086/api/users/reset-password-with-otp', {
    email,
    otp,
    newPassword
  });
}

logout() {
  // Clear token
  localStorage.removeItem('token');
  // Optionally clear role
  localStorage.removeItem('role');
  // Call backend logout if you use session
  return this.http.post('/logout', {}).subscribe({
    next: () => console.log('Logged out from backend'),
    error: (err) => console.error('Logout error', err)
  });


  this.inactivityService.logout();
 this.router.navigate(['/unlockuser'])
}

getSuppliers() {
  return this.http.get<Suppliers[]>('http://localhost:8086/api/users/getSupplier')
  .subscribe({
        next: (data) => {
          this.suppliers = data;
        },
        error: (err) => {
          console.error('Error fetching suppliers:', err);
        }
      });;

}


 fetchSuppliers() {
    this.http.get<Suppliers[]>('http://localhost:8086/api/users/getSupplier')
      .subscribe({
        next: (data) => {
          this.suppliers = data;
        },
        error: (err) => {
          console.error('Error fetching suppliers:', err);
        }
      });
  }

  
 
  // users.service.ts
// Get user by id (include Authorization header)
getUserById(userId: string): Observable<User> {
  const headers = this.getAuthHeaders();
  // NOTE: use `${baseUrl}/${userId}` (not baseUrl/users/${userId})
  return this.http.get<User>(`${this.baseUrl}/${userId}`, { headers });
}
 
 
// updateUserProfile: send partial profile DTO (returns User)
updateUserProfile(userId: string, profileData: any): Observable<User> {
  const headers = this.getAuthHeaders();
  return this.http.put<User>(
    `${this.baseUrl}/${userId}/profile`,
    profileData,
    { headers }
  );
}


// getUserById(userId: string): Observable<User> {
//   return this.http.get<User>(`${this.baseUrl}/users/${userId}`);
// }

// updateUserProfile(userId: string, data: Partial<User>): Observable<User> {
//   return this.http.put<User>(`${this.apiUrl}/users/${userId}`, data);
// }

// Helper method to include Authorization header
private getAuthHeaders(): HttpHeaders {
  const token = localStorage.getItem('token');
  return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
}




}