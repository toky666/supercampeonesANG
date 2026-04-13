import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeServicesService {
  API_ENDPOINT = 'http://localhost:3081';

  private http = inject(HttpClient);

   findMe(): Observable<any> {
      return this.http.get(this.API_ENDPOINT + '/me', {
        withCredentials: true 
      });
    }
}
