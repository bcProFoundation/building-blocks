import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailService } from './email.service';
import { MatSnackBar } from '@angular/material';
import { NEW_ID } from '../constants/common';
import { FormGroup, FormControl } from '@angular/forms';
import { CLIENT_ERROR, CLIENT_UPDATED } from '../constants/messages';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
})
export class EmailComponent implements OnInit {
  uuid: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  hide: boolean = true;

  emailForm = new FormGroup({
    host: new FormControl(this.host),
    port: new FormControl(this.port),
    user: new FormControl(this.user),
    pass: new FormControl(this.pass),
    from: new FormControl(this.from),
  });
  constructor(
    private readonly emailService: EmailService,
    route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
    this.uuid = route.snapshot.params.uuid;
  }

  ngOnInit() {
    if (this.uuid !== NEW_ID) {
      this.emailService.getEmail(this.uuid).subscribe({
        next: response => {
          this.host = response.host;
          this.port = response.port;
          this.user = response.user;
          this.pass = response.pass;
          this.from = response.from;
          this.emailForm.controls.host.setValue(response.host);
          this.emailForm.controls.port.setValue(response.port);
          this.emailForm.controls.user.setValue(response.user);
          this.emailForm.controls.pass.setValue(response.pass);
          this.emailForm.controls.from.setValue(response.from);
        },
      });
    }
  }
  createEmail() {
    this.emailService
      .createEmail(
        this.emailForm.controls.host.value,
        this.emailForm.controls.port.value,
        this.emailForm.controls.user.value,
        this.emailForm.controls.pass.value,
        this.emailForm.controls.from.value,
      )
      .subscribe({
        next: response => {},
        error: error => {
          this.snackbar.open(CLIENT_ERROR, 'Close', { duration: 2500 });
        },
      });
  }

  updateEmail() {
    this.emailService
      .updateEmail(
        this.uuid,
        this.emailForm.controls.host.value,
        this.emailForm.controls.port.value,
        this.emailForm.controls.user.value,
        this.emailForm.controls.pass.value,
        this.emailForm.controls.from.value,
      )
      .subscribe({
        next: () => {
          this.snackbar.open(CLIENT_UPDATED, 'Close', { duration: 2500 });
        },
      });
  }
}
