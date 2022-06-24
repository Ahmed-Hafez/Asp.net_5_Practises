import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(
    private accountService: AccountService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  register() {
    this.accountService
      .register(this.registerModel.username, this.registerModel.password)
      .subscribe((response) => {
        this.toastrService.success(
          `Registered "${response.username}" Successfully`
        );
        this.cancel();
      });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
