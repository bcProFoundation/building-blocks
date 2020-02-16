import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailService } from './email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NEW_ID, DURATION } from '../../constants/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  CREATE_SUCCESSFUL,
  CLOSE,
  CREATE_ERROR,
  UPDATE_SUCCESSFUL,
  UPDATE_ERROR,
} from '../../constants/messages';

export const EMAIL_LIST_ROUTE = '/email/list';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css'],
})
export class EmailComponent implements OnInit {
  uuid: string;
  name: string;
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  hide: boolean = true;
  isPasswordRequired: boolean = false;

  emailForm = new FormGroup({
    name: new FormControl(this.name),
    host: new FormControl(this.host),
    port: new FormControl(this.port),
    user: new FormControl(this.user),
    pass: new FormControl(this.pass),
    from: new FormControl(this.from),
  });

  constructor(
    private readonly emailService: EmailService,
    route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.uuid = route.snapshot.params.id;
  }

  ngOnInit() {
    if (this.uuid !== NEW_ID) {
      this.emailService.getEmail(this.uuid).subscribe({
        next: response => {
          this.name = response.name;
          this.host = response.host;
          this.port = response.port;
          this.user = response.user;
          this.pass = response.pass;
          this.from = response.from;
          this.emailForm.controls.name.setValue(response.name);
          this.emailForm.controls.host.setValue(response.host);
          this.emailForm.controls.port.setValue(response.port);
          this.emailForm.controls.user.setValue(response.user);
          this.emailForm.controls.pass.setValue(response.pass);
          this.emailForm.controls.from.setValue(response.from);
        },
      });
    } else {
      this.emailForm.controls.pass.setValidators([Validators.required]);
      this.isPasswordRequired = true;
    }
  }
  createEmail() {
    this.emailService
      .createEmail(
        this.emailForm.controls.name.value,
        this.emailForm.controls.host.value,
        this.emailForm.controls.port.value,
        this.emailForm.controls.user.value,
        this.emailForm.controls.pass.value,
        this.emailForm.controls.from.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(CREATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(EMAIL_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(CREATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }

  updateEmail() {
    this.emailService
      .updateEmail(
        this.uuid,
        this.emailForm.controls.name.value,
        this.emailForm.controls.host.value,
        this.emailForm.controls.port.value,
        this.emailForm.controls.user.value,
        this.emailForm.controls.pass.value,
        this.emailForm.controls.from.value,
      )
      .subscribe({
        next: success => {
          this.snackBar.open(UPDATE_SUCCESSFUL, CLOSE, { duration: DURATION });
          this.router.navigateByUrl(EMAIL_LIST_ROUTE);
        },
        error: error =>
          this.snackBar.open(UPDATE_ERROR, CLOSE, { duration: DURATION }),
      });
  }
}
