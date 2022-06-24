import { Observable, ReplaySubject, tap } from 'rxjs';
import { ApiService } from './../../core/services/api/api.service';
import { Injectable } from '@angular/core';
import { User } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  readonly apiUrl: string = 'api/account';

  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private apiService: ApiService) {}

  login(username: string, password: string): Observable<User> {
    return this.apiService
      .post<User>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          this.currentUserSource.next(response);
          localStorage.setItem('user', JSON.stringify(response));
        })
      );
  }

  register(username: string, password: string): Observable<User> {
    return this.apiService
      .post<User>(`${this.apiUrl}/register`, {
        username,
        password,
      })
      .pipe(
        tap((response: User) => {
          if (response) {
            this.currentUserSource.next(response);
            localStorage.setItem('user', JSON.stringify(response));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setCurrentUser() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.currentUserSource.next(user);
  }
}
