import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { admin, LoginService, Menu } from '@core';
import { map } from 'rxjs/operators';

/**
 * You should delete this file in the real APP.
 */
@Injectable()
export class FakeLoginService extends LoginService {
  //private token = { access_token: 'MW56YjMyOUAxNjMuY29tWm9uZ2Jpbg==', token_type: 'bearer' };
  private roles = localStorage.getItem('_s') as string;;
  private token = { 
    access_token: localStorage.getItem('_s') ?? '', 
    token_type: 'bearer' 
  };

  override login() {
    // Leer el token que el backend ya generó y guardaste en localStorage
    this.token.access_token = localStorage.getItem('_s') ?? '';
    return of(this.token);
  }

  override refresh() {
    return of(this.token);
  }

  override logout() {
    return of({});
  }

  override user() {
    return of(admin);
  }

  override menu() {
    return this.http
      .get<{ menu: Menu[] }>('data/menu.json?_t=' + Date.now())
      .pipe(map((res) => res.menu));
  }

  override secretaria() {
    return this.http
      .get<{ menu: Menu[] }>('data/secretaria.json?_t=' + Date.now())
      .pipe(map((res) => res.menu));
  }
}
