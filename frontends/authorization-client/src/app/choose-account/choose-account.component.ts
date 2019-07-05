import { Component, OnInit } from '@angular/core';
import { ChooseAccountService } from './choose-account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { stringify } from 'querystring';
import { environment } from '../../environments/environment.prod';
import { FormGroup, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-choose-account',
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.css'],
})
export class ChooseAccountComponent implements OnInit {
  sessionUsers: any[];

  userForm = new FormArray([]);
  userSelectionForm = new FormGroup({
    users: this.userForm,
  });

  constructor(
    private activeRoute: ActivatedRoute,
    private chooseAccountService: ChooseAccountService,
    private router: Router,
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
    this.chooseAccountService
      .chooseUser(this.sessionUsers[index].uuid)
      .subscribe({
        next: success => {
          const query = { ...this.activeRoute.snapshot.queryParams };
          if (query.prompt) {
            delete query.prompt;
            window.location.href =
              environment.routes.CONFIRMATION + '?' + stringify(query);
          } else {
            window.location.href = '/';
          }
        },
        error: error => {},
      });
  }

  logoutUser(index: number) {
    this.chooseAccountService
      .logoutUser(this.sessionUsers[index].uuid)
      .subscribe({
        next: success => {
          this.sessionUsers.splice(index, 1);
          this.userForm.removeAt(index);
        },
        error: error => {},
      });
  }

  addAccount() {
    const query = { ...this.activeRoute.snapshot.queryParams };
    query.login_type = 'add_account';
    this.router.navigate(['/login'], { queryParams: query });
  }
}
