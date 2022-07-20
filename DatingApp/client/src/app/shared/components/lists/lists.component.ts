import { LikesParams } from './../../models/likes-params.model';
import { LikesService } from './../../../api-services/like/likes.service';
import { LikeType } from './../../enums/like-type.enum';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Member } from '../../models/member.model';
import { Pagination } from '../../models/pagination.model';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit, OnChanges {
  LikeType = LikeType;
  members: Partial<Member[]>;
  likeType: LikeType = LikeType.Liked;
  pageNumber = 1;
  pageSize = 5;
  pagination: Pagination;

  constructor(private likesService: LikesService) {}

  ngOnInit(): void {
    this.loadLikes();
    setInterval(() => {
      console.log(this.likeType);
    }, 2000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  loadLikes() {
    let likesParams: LikesParams = {
      likeType: this.likeType,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    this.likesService.getLikes(likesParams).subscribe((response) => {
      this.members = response.result;
      this.pagination = response.pagination;
    });
  }

  pageChanged(event: any) {
    this.pageNumber = event.page;
    this.loadLikes();
  }
}
