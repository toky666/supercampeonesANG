// auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const dialog = inject(MatDialog);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && error.error?.type === 'REFRESH_INVALID') {
        // Cerrar todos los dialogs abiertos
        dialog.closeAll();
        
        // Limpiar localStorage
        localStorage.clear();
        
        // Redirigir al login
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};