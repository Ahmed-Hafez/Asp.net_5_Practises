import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Member } from 'src/app/shared/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  readonly apiUrl: string = 'api/users';

  constructor(private apiService: ApiService) {}

  getMembers() {
    return this.apiService.get<Member[]>(this.apiUrl);
  }

  getMember(username: string) {
    return this.apiService.get<Member>(`${this.apiUrl}/${username}`);
  }
}
