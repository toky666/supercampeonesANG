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

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    email: ['coronelchavezyoky@gmail.com', [Validators.required]],
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

  login() {
    this.authService.login(this.loginForm.value as emailInterfaz).subscribe({
      next: (data) => {
        const user = data.data ?? data;
        const token = user.token;
        const image = user.image;
        const names = user.names;
        console.log('**********************************');
        console.log(user);
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
        console.log('entro login ' + currentUser.token);
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
    });
  }
}
