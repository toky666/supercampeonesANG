import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { usersInterfaz } from '../Interfaces/usersInterfaz';
import { UserStateService } from '../sessions/login/UserStateService';
@Injectable({
  providedIn: 'root',
})
export class UsersServicesService {
  API_ENDPOINT = 'http://localhost:3081/api';

  private http = inject(HttpClient);

  private userStateService = inject(UserStateService);
  /*_token() {
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

  save(data: usersInterfaz): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/users', { user: data }, { withCredentials: true });
  }

  dataTablePagination(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/users/datatable', query, {
      withCredentials: true,
    });
  }

  doFilter(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/users/dofilter', query);
  }

  update(id: any, edit: any): Observable<any> {
    return this.http.put(
      this.API_ENDPOINT + '/users/' + id,
      { data: edit },
      {
        withCredentials: true,
      },
    );
  }

  findOne(id: any): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/users/' + id, {
      withCredentials: true,
    }) as Observable<any>;
  }

  remove(id: any): Observable<any> {
    return this.http.delete(this.API_ENDPOINT + '/users/' + id, {
      withCredentials: true,
    });
  }

  findEmail(search: any): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/get_email/' + search, {
      withCredentials: true,
    });
  }
}
