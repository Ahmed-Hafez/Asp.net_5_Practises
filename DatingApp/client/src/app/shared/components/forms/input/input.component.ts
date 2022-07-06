import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Component, Input, OnInit, Self } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';
  @Input() customErrors: { errorName: string; errorMessage: string }[];

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {}

  registerOnChange(fn: any): void {}

  registerOnTouched(fn: any): void {}
}
