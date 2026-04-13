import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { rolesInterfaz } from '../Interfaces/rolesInterfaz';
import { UserStateService } from '../sessions/login/UserStateService';

@Injectable({
  providedIn: 'root',
})
export class RolesServicesService {
  API_ENDPOINT = 'http://localhost:3081/api';

  private http = inject(HttpClient);
  private userStateService = inject(UserStateService);

  save(guardar: rolesInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/roles',
      { data: guardar },
      { withCredentials: true },
    );
  }

  dataTablePagination(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/roles/datatable', query, {
      withCredentials: true,
    });
  }

  doFilter(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/roles/dofilter', query, {
      withCredentials: true,
    });
  }

  update(id: any, edit: any): Observable<any> {
    return this.http.put(
      this.API_ENDPOINT + '/roles/' + id,
      { data: edit },
      {
        withCredentials: true,
      },
    );
  }

  findOne(id: any): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/roles/' + id, {
      withCredentials: true,
    }) as Observable<any>;
  }

  remove(id: any): Observable<any> {
    return this.http.delete(this.API_ENDPOINT + '/roles/' + id, {
      withCredentials: true,
    });
  }

  list(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/roles', {
      withCredentials: true,
    });
  }
}
