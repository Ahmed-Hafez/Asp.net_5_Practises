import { LikeType } from './../enums/like-type.enum';
import { PaginationParams } from './pagination-params.model';
import { User } from './user.model';

export class LikesParams extends PaginationParams {
  likeType: LikeType;
}
