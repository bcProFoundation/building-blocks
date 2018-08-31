import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { JwksValidationHandler } from 'angular-oauth2-oidc';
import { authConfig } from './auth/auth.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'app';
  serverMessage: string;
  clientMessage: string = 'Angular 6';
  clientId: string;

  constructor(
    private appService: AppService,
    private oauthService: OAuthService,
  ) {}

  private configureWithNewConfigApi() {
    this.oauthService.configure(authConfig(this.clientId));
    this.oauthService.tokenValidationHandler = new JwksValidationHandler();
    this.oauthService.loadDiscoveryDocumentAndLogin();
  }

  ngOnInit() {
    this.getClientId();
    this.configureWithNewConfigApi();
  }

  getServerMessage(): void {
    this.appService.getMessage().subscribe(response => {
      this.serverMessage = response.message;
    });
  }

  getClientId(): void {
    this.appService.getClientId().subscribe(response => {
      this.clientId = response.message.clientId;
    });
  }
}
