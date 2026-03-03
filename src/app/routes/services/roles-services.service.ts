import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
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

  private rolesSubject = new BehaviorSubject<rolesInterfaz[]>([]);
  roles$ = this.rolesSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  save(guardar: rolesInterfaz) {
    return this.http
      .post<rolesInterfaz>(
        this.API_ENDPOINT + '/roles',
        { data: guardar },
        { headers: this._header() },
      )
      .pipe(
        tap((nuevo) => {
          const current = this.rolesSubject.value;
          this.rolesSubject.next([...current, nuevo]);
        }),
      );
  }

  dataTablePagination(query: any): Observable<any> {
    return this.http
      .post(this.API_ENDPOINT + '/roles/datatable', query, { headers: this._header() })
      .pipe(
        tap((resp: any) => {
          this.rolesSubject.next(resp.data); // llena el BehaviorSubject
          this.totalSubject.next(resp.count); // opcional: total de registros
        }),
      );
  }

  save2222(guardar: rolesInterfaz) {
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

  dataTablePagination222222(query: any): Observable<any> {
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

  remove22222(id: any): Observable<any> {
    return this.http.delete(this.API_ENDPOINT + '/roles/' + id, {
      headers: this._header(),
    });
  }
  remove(id: any): Observable<any> {
    return this.http
      .delete(this.API_ENDPOINT + '/roles/' + id, {
        headers: this._header(),
      })
      .pipe(
        tap(() => console.log(`Rol ${id} eliminado`)), // logging automático
        catchError((err) => {
          console.error('Error eliminando rol:', err);
          return throwError(() => err); // manejo centralizado de errores
        }),
      );
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
