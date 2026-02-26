import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { rolesInterfaz } from '../Interfaces/rolesInterfaz';

@Injectable({
  providedIn: 'root',
})
export class RolesServicesService {
  API_ENDPOINT = 'http://localhost:3081/api';

  private http = inject(HttpClient);

  _token() {
    const user = localStorage.getItem('currentUser');
    return user ? (JSON.parse(user)?.token ?? '') : '';
  }

  _header() {
    let headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.append('Authorization', 'Token ' + this._token());
    console.log(headers);
    return headers;
  }

  save(guardar: rolesInterfaz) {
    return this.http.post(
      this.API_ENDPOINT + '/roles',
      { data: guardar },
      { headers: this._header() },
    );
  }

  update(id: any, edit: any): Observable<any> {
    return this.http.put(
      this.API_ENDPOINT + '/roles/' + id,
      { data: edit },
      {
        headers: this._header(),
      },
    );
  }

  list(): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/roles', {
      headers: this._header(),
    });
  }

  findOne(id: any): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/roles/' + id, {
      headers: this._header(),
    }) as Observable<any>;
  }

  dataTablePagination(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/roles/datatable', query, {
      headers: this._header(),
    });
  }

  search(query: any): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/roles/search', query, {
      headers: this._header(),
    });
  }
  /*
  searchList(query: any, component: string): Observable<any> {
    return this.http
      .post(this.API_ENDPOINT + '/forms/search', query, {
        headers: this._header(),
      })
      .pipe(
        map((response: Response) => {
          if (response['success'] && response['data']) {
            return response['data'];
          } else {
            return [];
          }
        })
      );
  }*/

  remove(id: any): Observable<any> {
    return this.http.delete(this.API_ENDPOINT + '/roles/' + id, {
      headers: this._header(),
    });
  }

  searchRoles(search: string): Observable<any> {
    return this.http.get(this.API_ENDPOINT + '/roles_nombre/' + search, {
      headers: this._header(),
    });
  }

  saveFile(formData: FormData): Observable<any> {
    return this.http.post(this.API_ENDPOINT + '/upload/save/roles', formData, {
      //headers: this._header()
    });
  }
}
