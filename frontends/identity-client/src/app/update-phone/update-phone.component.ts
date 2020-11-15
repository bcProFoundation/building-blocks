import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay, map } from 'rxjs/operators';
import { UpdatePhoneService } from './update-phone.service';
import { DURATION, UNDO_DURATION } from '../constants/app-constants';
import { CLOSE, ENTER_VALID_PHONE } from '../constants/messages';

@Component({
  selector: 'app-update-phone',
  templateUrl: './update-phone.component.html',
  styleUrls: ['./update-phone.component.css'],
})
export class UpdatePhoneComponent implements OnInit {
  otp: string;
  phone: string;
  isSendDisabled: boolean;
  isOTPHidden: boolean = true;
  updatePhoneForm = new FormGroup({
    otp: new FormControl(),
    phone: new FormControl(),
  });

  constructor(
    private updatePhone: UpdatePhoneService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit() {}

  editPhone() {
    this.updatePhoneForm.controls.phone.reset();
    this.updatePhoneForm.controls.phone.enable();
  }

  addUnverifiedPhone() {
    this.updatePhoneForm.controls.phone.disable();
    this.isSendDisabled = true;
    this.updatePhone
      .addUnverifiedPhone(this.updatePhoneForm.controls.phone.value)
      .pipe(
        map(data => (this.isOTPHidden = false)),
        delay(UNDO_DURATION),
      )
      .subscribe({
        next: success => (this.isSendDisabled = false),
        error: ({ error }) => {
          this.isSendDisabled = false;
          if (Array.isArray(error.message)) {
            this.snackBar.open(ENTER_VALID_PHONE, CLOSE, {
              duration: DURATION,
            });
          } else {
            this.snackBar.open(error.message, CLOSE, { duration: DURATION });
          }
        },
      });
  }

  verifyOtp() {
    this.updatePhone
      .verifyPhone(this.updatePhoneForm.controls.otp.value)
      .subscribe({
        next: success => {
          this.router.navigate(['profile']);
        },
        error: ({ error }) => {
          this.snackBar.open(error.message, CLOSE, { duration: DURATION });
        },
      });
  }
}
