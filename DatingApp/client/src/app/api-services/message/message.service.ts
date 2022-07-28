import { ApiService } from './../../core/services/api/api.service';
import { Injectable } from '@angular/core';
import { Message } from 'src/app/shared/models/message.model';
import { MessageParams } from 'src/app/shared/models/message-params.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  readonly apiUrl: string = 'api/messages';

  constructor(private apiService: ApiService) {}

  getMessages(messageParams: MessageParams) {
    let params = this.apiService.getPaginationHeaders(
      messageParams.pageNumber,
      messageParams.pageSize
    );
    params = params.append('Container', messageParams.container);
    return this.apiService.getPaginatedResult<Message[]>(this.apiUrl, params);
  }

  getMessageThread(username: string) {
    return this.apiService.get<Message[]>(`${this.apiUrl}/thread/${username}`);
  }

  sendMessage(username: string, content: string) {
    return this.apiService.post<Message>(`${this.apiUrl}`, {
      recipientUsername: username,
      content,
    });
  }

  deleteMessage(id: number) {
    return this.apiService.delete(`${this.apiUrl}/${id}`);
  }
}
