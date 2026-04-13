import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { emailInterfaz } from '../Interfaces/emailInterfaz';
import { UserStateService } from '../sessions/login/UserStateService';

@Injectable({
  providedIn: 'root',
})
export class AuthServicesService {
  API_ENDPOINT = 'http://localhost:3081';
  private http = inject(HttpClient);
  private userStateService = inject(UserStateService);

  login(data: emailInterfaz): Observable<any> {
    return this.http.post(
      this.API_ENDPOINT + '/users/login',
      { user: data },
      { withCredentials: true }, // ← Agregar esto
    );
  }
  refreshToken(): Observable<any> {
    return this.http.post(
      this.API_ENDPOINT + '/users/refreshToken',
      { refreshToken: this.userStateService.getUser() },
      { withCredentials: true }, // ← importante para enviar/recibir cookies
    );
  }
}
