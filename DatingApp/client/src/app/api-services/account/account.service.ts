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
        tap((user) => {
          if (user) {
            this.setCurrentUserToLocalStorage(user);
          }
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
        tap((user: User) => {
          if (user) {
            this.setCurrentUserToLocalStorage(user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  setCurrentUserFromLocalStorage() {
    const user: User = JSON.parse(localStorage.getItem('user'));
    this.currentUserSource.next(user);
  }

  setCurrentUserToLocalStorage(user: User) {
    this.currentUserSource.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
}
