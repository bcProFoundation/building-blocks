import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../profile/profile.service';
import { UserResponse } from '../interfaces/user-response.interface';
import { MultifactorService } from './multifactor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multifactor',
  templateUrl: './multifactor.component.html',
  styleUrls: ['./multifactor.component.css'],
})
export class MultifactorComponent implements OnInit {
  enableDisable: boolean;
  hideWarningMessage: boolean;
  hideQRSecret: boolean = true;
  qrCode: string;
  sharedSecret: string;
  otp: string;
  hideDisable2fa: boolean = true;

  constructor(
    private profileService: ProfileService,
    private mfaService: MultifactorService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscribeGetUser();
  }

  enableDisable2fa() {
    if (!this.enableDisable) {
      this.mfaService.enable2fa().subscribe({
        next: (response: { qrImage: string; key: string }) => {
          this.hideWarningMessage = true;
          this.hideQRSecret = false;
          this.qrCode = response.qrImage;
          this.sharedSecret = response.key;
        },
      });
    } else if (this.enableDisable) {
      this.mfaService.disable2fa().subscribe({
        next: response => {
          this.router.navigate(['/profile']);
        },
      });
    }
  }

  verifyOtp() {
    this.mfaService.verify2fa(this.otp).subscribe({
      next: response => {
        this.router.navigate(['/profile']);
      },
    });
  }

  disable2faVerify() {}

  subscribeGetUser() {
    this.profileService.getAuthServerUser().subscribe({
      next: (response: UserResponse) => {
        this.enableDisable = response.enable2fa;
      },
    });
  }
}
