import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { ConnectedServiceNames } from './connected-services';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  constructor(private readonly accountService: AccountService) {}

  ngOnInit() {
    this.accountService.subscribeInfo().subscribe({
      next: success => {
        let services = [];
        if (success.service && success.services.length > 0) {
          services = success.services;
        }
        const idp = services.find(service => {
          if (service.type === ConnectedServiceNames.IDENTITY_PROVIDER) {
            return service;
          }
        });

        if (idp) {
          window.location.href = idp.url;
        }
      },
      error: error => {},
    });
  }
}
