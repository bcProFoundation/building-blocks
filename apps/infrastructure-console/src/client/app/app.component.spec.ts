import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AppService } from './app.service';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

const reqResp = {
  uuid: '19421784-bb3d-4b4a-8994-dfe8f3eddf5a',
  _id: '5ba0a00ca346651ecdf5af0c',
  appURL: 'http://infra.localhost:3200',
  authServerURL: 'http://auth.localhost:3000',
  clientId: 'fb670ac1-03e3-4618-8db1-8bca8131018c',
  profileURL: 'http://auth.localhost:3000/oauth2/profile',
  tokenURL: 'http://auth.localhost:3000/oauth2/get_token',
  introspectionURL: 'http://auth.localhost:3000/oauth2/introspection',
  authorizationURL: 'http://auth.localhost:3000/oauth2/confirmation',
  callbackURLs: ['http://infra.localhost:3200/index.html'],
  revocationURL: 'http://auth.localhost:3000/oauth2/revoke',
};

const appServiceStub: Partial<AppService> = {
  getMessage: () => {
    return of(reqResp);
  },
};

const oauthServiceStub: Partial<OAuthService> = {
  configure(...args) {},
  setupAutomaticSilentRefresh(...args) {},
  loadDiscoveryDocumentAndTryLogin(optins?: any): Promise<void> {
    return Promise.resolve();
  },
};

@Component({ selector: 'app-dashboard-nav', template: '' })
class DashboardNavComponent {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, MaterialModule, BrowserAnimationsModule],
      declarations: [AppComponent, DashboardNavComponent],
      providers: [
        {
          provide: AppService,
          useValue: appServiceStub,
        },
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
