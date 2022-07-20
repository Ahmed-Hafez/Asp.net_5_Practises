import { PaginationParams } from './pagination-params.model';
import { User } from './user.model';

export class UserParams extends PaginationParams {
  gender: string;
  minAge = 18;
  maxAge = 99;
  orderBy = 'lastActive';

  constructor(user: User) {
    super();
    this.gender = user.gender === 'female' ? 'male' : 'female';
  }
}
