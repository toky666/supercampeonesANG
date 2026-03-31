import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { emailInterfaz } from '../Interfaces/emailInterfaz';

@Injectable({
  providedIn: 'root',
})
export class AuthServicesService {
  API_ENDPOINT = 'http://localhost:3081';
  private http = inject(HttpClient);

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

  login(data: emailInterfaz): Observable<any> {
    return this.http.post(
      this.API_ENDPOINT + '/users/login',
      { user: data },
      {
        headers: this._header(),
      },
    );
  }
}
