import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProfileService } from './profile.service';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({ selector: 'app-password-requirement', template: '' })
class PasswordRequirementComponent {}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async(() => {
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
          },
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
