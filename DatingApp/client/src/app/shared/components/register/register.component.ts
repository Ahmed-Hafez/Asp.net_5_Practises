import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AccountService } from 'src/app/api-services/account/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerModel: { username: string; password: string } = {
    username: '',
    password: '',
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  register() {
    this.accountService
      .register(this.registerModel.username, this.registerModel.password)
      .subscribe((response) => {
        console.log(response);
        this.cancel();
      });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
