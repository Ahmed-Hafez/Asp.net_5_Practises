import { PaginatedResult } from './../../shared/models/pagination.model';
import { LikesParams } from './../../shared/models/likes-params.model';
import { ApiService } from 'src/app/core/services/api/api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LikeType } from 'src/app/shared/enums/like-type.enum';
import { Member } from 'src/app/shared/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  readonly apiUrl: string = 'api/likes';
  constructor(private apiService: ApiService) {}

  addLike(username: string): Observable<null> {
    return this.apiService.post(`${this.apiUrl}/${username}`, {});
  }

  getLikes(likesParams: LikesParams): Observable<PaginatedResult<Member[]>> {
    let params = this.apiService.getPaginationHeaders(
      likesParams.pageNumber,
      likesParams.pageSize
    );

    return this.apiService.getPaginatedResult<Partial<Member[]>>(
      `${this.apiUrl}?likeType=${likesParams.likeType}`,
      params
    );
  }
}
