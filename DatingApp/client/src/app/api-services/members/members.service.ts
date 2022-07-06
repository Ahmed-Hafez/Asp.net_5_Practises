import { AccountService } from './../account/account.service';
import { environment } from './../../../environments/environment';
import { Observable, of, tap, take, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Member } from 'src/app/shared/models/member.model';
import { UserParams } from 'src/app/shared/models/user-params.model';
import { User } from 'src/app/shared/models/user.model';
import { PaginatedResult } from 'src/app/shared/models/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly apiUrl: string = 'api/users';
  readonly addingPhotoUrl: string = `${environment.apiBaseUrl}${this.apiUrl}/add-photo`;
  memberCache = new Map();
  user: User;

  private _userParams: UserParams;
  set userParams(params: UserParams) {
    this._userParams = params;
  }
  get userParams(): UserParams {
    return this._userParams;
  }

  constructor(
    private apiService: ApiService,
    private accountService: AccountService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams): Observable<PaginatedResult<Member[]>> {
    var response = this.memberCache.get(Object.values(userParams).join('-'));
    if (response) {
      return of(response);
    }

    let params = this.apiService.getPaginationHeaders(
      userParams.pageNumber,
      userParams.pageSize
    );

    params = params.append('minAge', userParams.minAge.toString());
    params = params.append('maxAge', userParams.maxAge.toString());
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.apiService
      .getPaginatedResult<Member[]>(this.apiUrl, params)
      .pipe(
        map((response) => {
          this.memberCache.set(Object.values(userParams).join('-'), response);
          return response;
        })
      );
  }

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.result), [])
      .find((member: Member) => member.username === username);

    if (member) {
      return of(member);
    }
    return this.apiService.get<Member>(`${this.apiUrl}/${username}`);
  }

  updateMember(member: Member): Observable<null> {
    return this.apiService.put<null>(this.apiUrl, member);
  }

  setMainPhoto(photoId: number): Observable<null> {
    return this.apiService.put<null>(
      `${this.apiUrl}/set-main-photo/${photoId}`,
      {}
    );
  }

  deletePhoto(photoId: number): Observable<null> {
    return this.apiService.delete(`${this.apiUrl}/delete-photo/${photoId}`);
  }
}
