import { Component, OnInit } from '@angular/core';
import { ChooseAccountService } from './choose-account.service';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { environment } from '../../environments/environment.prod';

@Component({
  selector: 'app-choose-account',
  templateUrl: './choose-account.component.html',
  styleUrls: ['./choose-account.component.css'],
})
export class ChooseAccountComponent implements OnInit {
  sessionUsers;

  constructor(
    private activeRoute: ActivatedRoute,
    private chooseAccountService: ChooseAccountService,
  ) {}

  ngOnInit() {
    this.sessionUsers = this.chooseAccountService.getSessionUsers();
  }

  chooseUser(uuid) {
    this.chooseAccountService.chooseUser(uuid).subscribe({
      next: success => {
        const query = { ...this.activeRoute.snapshot.queryParams };
        delete query.prompt;
        window.location.href =
          environment.routes.CONFIRMATION + '?' + stringify(query);
      },
      error: error => {},
    });
  }
}
