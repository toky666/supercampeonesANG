import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { emailInterfaz } from '../Interfaces/emailInterfaz';
@Injectable({
  providedIn: 'root',
})
export class EmailServicesService {
  API_ENDPOINT = 'http://localhost:3081/api';
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

  sendUser1(guardar: emailInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/email/sendmail',
      { data: guardar },
      { headers: this._header() },
    );
  }

  sendUser(guardar: emailInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/email/sendmail',
      {
        data: {
          email: guardar.email,
          password: guardar.password,
        }, 
      },
      {
        headers: this._header(),
      },
    );
  }

  sendContrasena(guardar: emailInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/email/sendcontrasena',
      { data: guardar },
      { headers: this._header() },
    );
  }
}
