import { Injectable, inject } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { catchError, switchMap, tap, throwError } from 'rxjs';
import { Menu, MenuService } from './menu.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);

  private http = inject(HttpClient);
  private menu = inject(MenuService);
  private router = inject(Router);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load(){
    const roles = localStorage.getItem('_t');
    console.log('entro load startup ');
    if (roles === '69a617c07352415788297102') {
      return new Promise<void>((resolve, reject) => {
        this.authService
          .change()
          .pipe(
            tap((user) => this.setPermissions(user)),
            switchMap(() => this.authService.menu()), // aqui peude direccionar los administradores
            tap((menu) => this.setMenu(menu)),
          )
          .subscribe({
            next: () => resolve(),
            error: () => resolve(),
          });
      });
    } else {
      
      return new Promise<void>((resolve, reject) => {
        this.authService
          .change()
          .pipe(
            tap((user) => this.setPermissions(user)),
            switchMap(() => this.authService.secretaria()), // aqui peude direccionar los administradores
            tap((menu) => this.setMenu(menu)),
          )
          .subscribe({
            next: () => resolve(),
            error: () => resolve(),
          });
      });
    }
  }
  load55555(): Promise<any> {
    const roles = localStorage.getItem('_s');
    console.log('entro load startup ');
    if (roles == '69a617c07352415788297102') {
      return new Promise((resolve, reject) => {
        this.http
          .get('public/data/menu.json?_t=' + Date.now())
          .pipe(
            catchError((res) => {
              resolve(null);
              return throwError(() => res);
            }),
          )
          .subscribe(
            (res: any) => {
              this.menu.addNamespace(res.menu, 'menu');
              this.menu.set(res.menu);
            },
            () => reject(),
            () => resolve(null),
          );
      });
    } else {
      console.log('ninguno');
      return Promise.resolve(null); // <-- aquí devuelves algo
    }
  }

  private setMenu(menu: Menu[]) {
    this.menuService.addNamespace(menu, 'menu');
    this.menuService.set(menu);
  }

  private setPermissions(user: User) {
    // In a real app, you should get permissions and roles from the user information.
    const permissions = ['canAdd', 'canDelete', 'canEdit', 'canRead'];
    this.permissonsService.loadPermissions(permissions);
    this.rolesService.flushRoles();
    this.rolesService.addRoles({ ADMIN: permissions });

    // Tips: Alternatively you can add permissions with role at the same time.
    // this.rolesService.addRolesWithPermissions({ ADMIN: permissions });
  }
}
