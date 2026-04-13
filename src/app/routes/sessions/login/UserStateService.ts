import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UsersServicesService } from '../../services/users-services.service';
import { MeServicesService } from '../../services/me-services.service';
import { Router } from '@angular/router';

export interface UserInfo {
  _id: string;
  names: string;
  idrol: string;
  token?: string;
  refreshToken?: string;
  token_type?: string;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private userSubject = new BehaviorSubject<UserInfo | null>(null);
  user$ = this.userSubject.asObservable();
  private authService = inject(MeServicesService);
  private router = inject(Router);
  constructor() {
    // Al iniciar la app, consulta /me
    this.authService.findMe().subscribe({
      next: (user) => {
        console.log('Usuario recuperado desde /me:', user);
        this.userSubject.next(user); // guarda todo el objeto
      },
      error: () => {
        console.warn('No se pudo recuperar el usuario desde /me');
        this.router.navigateByUrl('/auth/login');
      },
    });
  }

  setUser(user: UserInfo) {
    this.userSubject.next(user);
  }

  getUser(): UserInfo | null {
    return this.userSubject.value;
  }

  getIdRol(): string | null {
    return this.userSubject.value?.idrol ?? null;
  }
}
