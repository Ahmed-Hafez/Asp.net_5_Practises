import { Observable, of, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Member } from 'src/app/shared/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly apiUrl: string = 'api/users';
  members: Member[] = [];

  constructor(private apiService: ApiService) {}

  getMembers(): Observable<Member[]> {
    if (this.members.length > 0) return of(this.members);
    return this.apiService.get<Member[]>(this.apiUrl).pipe(
      tap((members) => {
        this.members = members;
        return members;
      })
    );
  }

  getMember(username: string): Observable<Member> {
    const member = this.members.find((x) => x.username === username);
    if (member !== undefined) return of(member);
    return this.apiService.get<Member>(`${this.apiUrl}/${username}`);
  }

  updateMember(member: Member): Observable<null> {
    return this.apiService.put<null>(this.apiUrl, member).pipe(
      tap(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
}
