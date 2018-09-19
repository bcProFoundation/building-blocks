import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { from } from 'rxjs';
import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({ selector: 'app-profile-nav', template: '' })
class ProfileNavComponent {}

describe('AppComponent', () => {
  const appServiceStub: Partial<AppService> = {
    getMessage: () => {
      return from([]);
    },
  };

  const oauthServiceStub: Partial<OAuthService> = {};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, ProfileNavComponent],
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
    expect(app).toBeDefined();
  }));
});
