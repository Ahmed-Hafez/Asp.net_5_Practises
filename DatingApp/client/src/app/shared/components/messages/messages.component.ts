import { MessageParams } from './../../models/message-params.model';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/api-services/message/message.service';
import { Message } from '../../models/message.model';
import { Pagination } from '../../models/pagination.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  messages: Message[] = [];
  pagination: Pagination;
  messagesParams: MessageParams = {
    pageNumber: 1,
    pageSize: 5,
    container: 'Unread',
  };
  loading = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loading = true;
    this.messageService
      .getMessages(this.messagesParams)
      .subscribe((response) => {
        this.messages = response.result;
        this.pagination = response.pagination;
        this.loading = false;
      });
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages.splice(
        this.messages.findIndex((m) => m.id === id),
        1
      );
    });
  }

  pageChanged(event: any) {
    this.messagesParams.pageNumber = event.page;
    this.loadMessages();
  }
}
