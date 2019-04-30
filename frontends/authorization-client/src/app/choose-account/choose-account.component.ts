import { Component, OnInit } from '@angular/core';
import { ChooseAccountService } from './choose-account.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
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

  addAccount() {
    const query = { ...this.activeRoute.snapshot.queryParams };
    query.login_type = 'add_account';
    this.router.navigate(['/login'], { queryParams: query });
  }
}
