import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = environment.apiBaseUrl;
  constructor(private httpClient: HttpClient) {}

  get<Tout>(url: string): Observable<Tout> {
    return this.httpClient.get<Tout>(this.baseUrl + url);
  }

  post<Tout>(url: string, body: any): Observable<Tout> {
    return this.httpClient.post<Tout>(this.baseUrl + url, body);
  }

  put<Tout>(url: string, body: any): Observable<Tout> {
    return this.httpClient.put<Tout>(this.baseUrl + url, body);
  }

  patch<Tout>(url: string, body: any): Observable<Tout> {
    return this.httpClient.patch<Tout>(this.baseUrl + url, body);
  }

  delete(url: string): Observable<null> {
    return this.httpClient.delete<null>(this.baseUrl + url);
  }
}
