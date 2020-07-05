import { Component, OnInit } from '@angular/core';
import { ChooseAccountService } from './choose-account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { environment } from '../../environments/environment';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import {
  UNDO,
  DURATION,
  REMOVE_USER_FROM_SESSION,
} from '../constants/app-strings';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-choose-account',
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.css'],
})
export class ChooseAccountComponent implements OnInit {
  sessionUsers: any[];
  disableChoice: boolean = false;
  flagLogoutUser: boolean;
  userForm = new FormArray([]);
  userSelectionForm = new FormGroup({
    users: this.userForm,
  });

  constructor(
    private activeRoute: ActivatedRoute,
    private chooseAccountService: ChooseAccountService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.chooseAccountService.getSessionUsers().subscribe({
      next: sessionUsers => {
        this.populateForm(sessionUsers);
      },
      error: error => {},
    });
  }

  populateForm(sessionUsers) {
    this.sessionUsers = sessionUsers;
    this.sessionUsers.forEach(user => {
      this.addUser(user);
    });
  }

  addUser(user) {
    this.userForm.push(
      new FormGroup({
        email: new FormControl(user.email),
        uuid: new FormControl(user.uuid),
        phone: new FormControl(user.phone),
      }),
    );
  }

  chooseUser(index: number) {
    this.disableChoice = true;
    this.chooseAccountService
      .chooseUser(this.sessionUsers[index].uuid)
      .subscribe({
        next: success => {
          const query = { ...this.activeRoute.snapshot.queryParams };
          if (query.prompt) {
            const params = new URLSearchParams();
            for (const key in query) {
              if (query.hasOwnProperty(key)) {
                params.set(key, query[key]);
              }
            }
            params.delete('prompt');
            window.location.href =
              environment.routes.CONFIRMATION + '?' + params.toString();
          } else {
            window.location.href = '/';
          }
        },
        error: error => (this.disableChoice = false),
      });
  }

  logoutUser(index: number) {
    this.disableChoice = true;
    this.flagLogoutUser = true;
    const snackBar = this.snackBar.open(REMOVE_USER_FROM_SESSION, UNDO, {
      duration: DURATION,
    });

    snackBar.afterDismissed().subscribe({
      next: dismissed => {
        if (this.flagLogoutUser) {
          this.chooseAccountService
            .logoutUser(this.sessionUsers[index].uuid)
            .subscribe({
              next: success => {
                this.disableChoice = false;
                this.sessionUsers.splice(index, 1);
                this.userForm.removeAt(index);
              },
              error: error => (this.disableChoice = true),
            });
        }
      },
      error: error => (this.disableChoice = false),
    });

    snackBar.onAction().subscribe({
      next: success => {
        this.flagLogoutUser = false;
        this.disableChoice = false;
      },
      error: error => {
        this.flagLogoutUser = false;
        this.disableChoice = false;
      },
    });
  }

  addAccount() {
    const query = { ...this.activeRoute.snapshot.queryParams };
    query.login_type = 'add_account';
    this.router.navigate(['/login'], { queryParams: query });
  }
}
