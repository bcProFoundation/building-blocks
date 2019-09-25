import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UpdatePhoneService } from './update-phone.service';
import { DURATION } from '../constants/app-constants';
import { MatSnackBar } from '@angular/material';
import { CLOSE } from '../constants/messages';
import { Router } from '@angular/router';

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
    otp: new FormControl(this.otp),
    phone: new FormControl(this.phone),
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
    this.updatePhone
      .addUnverifiedPhone(this.updatePhoneForm.controls.phone.value)
      .subscribe({
        next: success => {
          this.isSendDisabled = true;
          setTimeout(() => (this.isSendDisabled = false), DURATION);
          this.isOTPHidden = false;
        },
        error: ({ error }) => {
          this.snackBar.open(error.message, CLOSE, { duration: DURATION });
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
