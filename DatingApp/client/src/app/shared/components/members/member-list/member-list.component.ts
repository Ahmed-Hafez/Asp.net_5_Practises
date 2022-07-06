import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/api-services/members/members.service';
import { Member } from 'src/app/shared/models/member.model';
import { Pagination } from 'src/app/shared/models/pagination.model';
import { UserParams } from 'src/app/shared/models/user-params.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];
  pagination: Pagination;
  userParams: UserParams;
  user: User;
  genderList = [
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];

  constructor(private memberService: MembersService) {
    this.userParams = this.memberService.userParams;
  }

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.userParams = this.userParams;
    this.memberService.getMembers(this.userParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.userParams = this.userParams;
    this.loadMembers();
  }
}
