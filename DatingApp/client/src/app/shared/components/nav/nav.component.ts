import { Observable } from 'rxjs';
import { AccountService } from './../../../api-services/account/account.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  loginModel: { username: string; password: string };

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {
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
        .subscribe({
          next: (response: User) => {
            this.router.navigateByUrl('/members');
          },
          error: (err) => {
            this.toastr.error(err.error);
          },
        });
  }

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
