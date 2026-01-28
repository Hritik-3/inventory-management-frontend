// src/app/auth.guard.ts
import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {


  if (typeof window === 'undefined') {
      // Running on server or in Node
      return false;
    }
  const token = localStorage.getItem('token');
  if (token) {
    return true;
  }
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
