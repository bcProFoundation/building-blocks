import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService } from 'angular-oauth2-oidc';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';
import { from, of } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { MaterialModule } from '../material.module';
import { ProfileService } from './profile.service';
import { IDTokenClaims } from './id-token-claims.interfaces';

@Component({ selector: 'app-password-requirement', template: '' })
class PasswordRequirementComponent {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    const oauthServiceStub: Partial<OAuthService> = {
      getIdentityClaims() {
        return { roles: ['administrator'] };
      },
    };

    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
        {
          provide: ProfileService,
          useValue: {
            getPersonalDetails() {
              return from([]);
            },
            getAuthServerUser() {
              return from([]);
            },
            getProfileDetails() {
              return from([]);
            },
            checkServerForPhoneRegistration() {
              return from([]);
            },
            getOIDCProfile() {
              return of({} as IDTokenClaims);
            },
          } as Partial<ProfileService>,
        },
        MatSnackBar,
      ],
      declarations: [ProfileComponent, PasswordRequirementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
