import { Injectable, inject } from '@angular/core';
import { AuthService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { catchError, of, switchMap, tap, throwError } from 'rxjs';
import { Menu, MenuService } from './menu.service';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { UserStateService } from '@src/app/routes/sessions/login/UserStateService';
import { MeServicesService } from '@src/app/routes/services/me-services.service';

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
  private userStateService = inject(UserStateService);
  private meServices = inject(MeServicesService);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load2222() {
    console.log('Usuario guardado en memoria entro load startup:', this.userStateService.getUser());
    return new Promise<void>((resolve) => {
      this.userStateService.user$
        .pipe(
          switchMap((roles) => {
            console.log('roles desde idRol$', roles);
            return this.authService.change().pipe(
              tap((user) => this.setPermissions(user)),
              switchMap(() => {
                if (roles?.idrol === '69a617c07352415788297102') {
                  return this.authService.menu();
                } else {
                  return this.authService.secretaria();
                }
              }),
              tap((menu) => this.setMenu(menu)),
            );
          }),
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
  }
  load() {
    console.log('Iniciando validación de rol desde cookie...');
    return new Promise<void>((resolve) => {
      this.meServices
        .findMe() // 👈 hace GET /me con withCredentials
        .pipe(
          tap((user) => {
            console.log('Usuario recuperado desde /me:', user);
            this.setPermissions(user); // asigna permisos
          }),
          switchMap((user) => {
            // 👉 aquí comparas el idrol directamente
            if (user?.idrol === '69a617c07352415788297102') {
              return this.authService.menu();
            } else {
              if (user?.idrol === '69cedb603cbbe30840c133d3') {
                return this.authService.secretaria();
              } else {
                this.router.navigateByUrl('/auth/login');
                return of([]);
              }
            }
          }),
          tap((menu) => {
            this.setMenu(menu); // carga menú según rol
          }),
        )
        .subscribe({
          next: () => resolve(),
          error: () => resolve(),
        });
    });
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
