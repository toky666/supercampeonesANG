import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { AuthService, TokenService } from '@core/authentication';
import { AuthServicesService } from '../../services/auth-services.service';
import { emailInterfaz } from '../../Interfaces/emailInterfaz';
import { StartupService } from '@src/app/core';
import { UserStateService } from './UserStateService';
import { UsersServicesService } from '../../services/users-services.service';
import { MeServicesService } from '../../services/me-services.service';
import { UserData } from '../../Interfaces/userData';
import { BehaviorSubject } from 'rxjs';
import { AutoReloadService } from '@src/app/shared/auto-reload.service';

//PARA LLAMAR JAVASCRIPT/////
declare let alertify: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
  ],
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private authService = inject(AuthServicesService);
  private _startup = inject(StartupService);
  private _token = inject(TokenService);
  private _router = inject(Router);
  private userStateService = inject(UserStateService);
  private dataService = inject(UsersServicesService);

  private meService = inject(MeServicesService);
   private autoReloadService = inject(AutoReloadService);
  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    email: ['y@gmail.com', [Validators.required]],
    password: ['12345', [Validators.required]],
  });

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
  login() {
    this.authService.login(this.loginForm.value as emailInterfaz).subscribe({
      next: (resp) => {
        this.meService.findMe().subscribe({
          next: (user) => {
            console.log('Datos recibidos desde backend /me:', user);
            this.userSubject.next(user);
            localStorage.setItem('fecha_inicio', new Date().toISOString());
            this.autoReloadService.startWatching();
            this._startup.load();
            this.auth
              .login(this.email.value, this.password.value)
              .pipe(filter((authenticated) => authenticated))
              .subscribe({
                next: () => {
                  this.router.navigateByUrl('/');
                },
                error: () => {
                  console.log('mal login');
                },
              });
          },
          error: (err) => {
            console.error('Error al recuperar usuario desde /me:', err);
            this.router.navigateByUrl('/auth/login');
          },
        });
      },
      error: (err) => {
        console.error('Error en login:', err);
      },
    });
  }

  /*login() {
    this.authService.login(this.loginForm.value as emailInterfaz).subscribe({
      next: (data) => {
        const user = data.data ?? data;
        const token = user.token;
        const image = user.image;
        const names = user.names;
        localStorage.setItem('currentUser', JSON.stringify({ token, image, names }));
        const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
        if (currentUser && currentUser.token) {
          localStorage.setItem('_s', currentUser.token);
        }

        const hora = new Date().toLocaleString();
        localStorage.setItem('fecha_inicio', hora);
        console.log('entro login ' + currentUser.token);

        // 👉 Guardar el usuario completo en el UserStateService
        this.userStateService.setUser({
          _id: user._id,
          names: user.names,
          idrol: user.idrol,
          token: user.token,
          refreshToken: user.refreshToken
        });

        console.log('Usuario guardado en memoria:', this.userStateService.getUser());

        this._startup.load();
        this.auth
          .login(this.email.value, this.password.value)
          .pipe(filter((authenticated) => authenticated))
          .subscribe({
            next: () => {
              this.router.navigateByUrl('/');
            },
            error: () => {
              console.log('mal login');
            },
          });
      },
      error: () => {
        alertify.error('Correo o contraseña incorrectos');
      },
    });
  }*/
}
