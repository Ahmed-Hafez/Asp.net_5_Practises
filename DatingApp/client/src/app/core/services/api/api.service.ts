import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = environment.apiBaseUrl;
  constructor(private httpClient: HttpClient) {}

  get<Tout>(url: string): Observable<Tout> {
    return this.httpClient.get<Tout>(this.baseUrl + url);
  }

  getPaginatedResult<T>(
    url: string,
    params: HttpParams
  ): Observable<PaginatedResult<T>> {
    return this.httpClient
      .get<T>(this.baseUrl + url, { observe: 'response', params })
      .pipe(
        map((response) => {
          const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              response.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
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

  getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());

    return params;
  }
}
