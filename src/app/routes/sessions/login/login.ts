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

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    email: ['y@gmail.com', [Validators.required]],
    password: ['12345', [Validators.required]],
  });

  /*loginForm = new FormGroup({
    email: new FormControl<string>('y@gmail.com', { validators: [Validators.required] }),
    password: new FormControl<string>('12345', { validators: [Validators.required] }),
  });*/

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
  login3333() {
    this.isSubmitting = true;
    const perm =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OWMzMzMwMjM4MGVhZjBhYzRjYzk2MmYiLCJpZHJvbCI6IjY5YTYxN2MwNzM1MjQxNTc4ODI5NzEwMiIsIm5hbWVzIjoiWU9LWSIsImlhdCI6MTc3NDkxNTc5NiwiZXhwIjoxNzc0OTE2Njk2fQ.qfIxsk3loXMGJOw2xwl3oViZu_Hj9b_yAh5vDviHjWc';
    localStorage.setItem('_s', perm);
    console.log('entro login');
    console.log(perm);
    // localStorage.setItem('currentUser', JSON.stringify({ token, image, names }));
    const hora = new Date().toLocaleString();

    localStorage.setItem('fecha_inicio', hora);
    this.auth
      .login(this.email.value, this.password.value)
      .pipe(filter((authenticated) => authenticated))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach((key) => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        },
      });
  }

  login() {
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
        const perm = user.idrol;
        console.log(user.idrol);
        const hora = new Date().toLocaleString();
        localStorage.setItem('fecha_inicio', hora);
        const id = user._id;
        const idimagen = user.image;
        localStorage.setItem('_t', perm);
        this.userStateService.setIdRol(user.idrol);
        //localStorage.setItem('_s', token);
        console.log('entro login ' + currentUser.token);
        this._startup.load();
        this.auth
          .login(this.email.value, this.password.value)
          .pipe(filter((authenticated) => authenticated))
          .subscribe({
            next: () => {
              
              this.router.navigateByUrl('/');
               //this._startup.load();
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
  }
  login2222() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value as emailInterfaz).subscribe(
      (result) => {
        const data = result?.data;
        console.log('**********************************');
        console.log(data);
        const token = data.token;
        const image = data.image;
        const names = data.names;
        console.log('**********************************');
        console.log(data);
        localStorage.setItem('currentUser', JSON.stringify({ token, image, names }));
        const perm = data.idrol;
        const hora = new Date().toLocaleString();

        localStorage.setItem('fecha_inicio', hora);
        const id = data._id;
        const idimagen = data.image;
        localStorage.setItem('_s', perm);
        this._startup.load55555().then(() => {
          let url = (this._token as any).referrer?.url || '/';
          console.log('obteniendo el url');
          console.log(url);
          if (url.includes('/auth')) {
            url = '/';
            console.log('entro if ' + url);
            console.log(url);
          }
          this._router.navigateByUrl('/');
        });
      },
      (err) => {
        console.log('mal');
      },
    );
  }
}
