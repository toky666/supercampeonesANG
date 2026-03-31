import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Menu } from '@core';
import { Token, User } from './interface';
import { emailInterfaz } from '@src/app/routes/Interfaces/emailInterfaz';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  API_ENDPOINT = 'http://localhost:3081';

  _token() {
    const data = localStorage.getItem('currentUser');
    return data ? (JSON.parse(data)?.token ?? '') : '';
  }

  _header() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Token ' + this._token());
    console.log(headers);
    return headers;
  }

  login(email: string, password: string) {
    return this.http.post<Token>('/auth/login', { email, password });
  }


  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  user() {
    return this.http.get<User>('/user');
  }

  menu() {
    return this.http.get<{ menu: Menu[] }>('/user/menu').pipe(map((res) => res.menu));
  }
  secretaria() {
    return this.http.get<{ menu: Menu[] }>('/user/secretaria').pipe(map((res) => res.menu));
  }
}
