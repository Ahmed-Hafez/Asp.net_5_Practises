import { Observable } from 'rxjs';
import { AccountService } from './../../../api-services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  loginModel: { username: string; password: string };

  constructor(public accountService: AccountService) {
    this.loginModel = {
      username: '',
      password: '',
    };
  }

  ngOnInit(): void {}

  login(): void {
    if (
      this.loginModel.username.trim().length &&
      this.loginModel.password.trim().length
    )
      this.accountService
        .login(this.loginModel.username, this.loginModel.password)
        .subscribe();
  }

  logout(): void {
    this.accountService.logout();
  }
}
