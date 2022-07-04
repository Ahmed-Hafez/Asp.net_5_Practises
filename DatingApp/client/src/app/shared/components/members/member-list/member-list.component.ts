import { Component, OnInit } from '@angular/core';
import { MembersService } from 'src/app/api-services/members/members.service';
import { Member } from 'src/app/shared/models/member.model';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  members: Member[];

  constructor(private memberService: MembersService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe((members) => {
      this.members = members;
    });
  }
}
