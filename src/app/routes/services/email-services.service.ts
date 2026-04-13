import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { emailInterfaz } from '../Interfaces/emailInterfaz';
import { UserStateService } from '../sessions/login/UserStateService';
@Injectable({
  providedIn: 'root',
})
export class EmailServicesService {
  API_ENDPOINT = 'http://localhost:3081/api';
  private http = inject(HttpClient);

    private userStateService = inject(UserStateService);
   /* _token() {
      const user = this.userStateService.getUser(); // obtienes el usuario desde memoria
      console.log('Usuario completo desde servicios:', user?.token); // verifica el contenido del usuario
      return user?.token ?? '';
    }
  
    _header() {
      let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      const user = this.userStateService.getUser(); // obtienes el usuario desde memoria
      const token = user?.token ?? ''; // extraes el token
      headers = headers.append('Authorization', 'Token ' + token);
      console.log('Headers construidos:', headers);
      return headers;
    }*/

  sendUser1(guardar: emailInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/email/sendmail',
      { data: guardar },
      { withCredentials: true  },
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
        withCredentials: true  ,
      },
    );
  }

  sendContrasena(guardar: emailInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/email/sendcontrasena',
      { data: guardar },
      { withCredentials: true  },
    );
  }
}
