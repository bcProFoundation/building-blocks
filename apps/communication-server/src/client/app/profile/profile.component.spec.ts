import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService } from 'angular-oauth2-oidc';
import { ProfileService } from './profile.service';
import { from } from 'rxjs';
import { MatSnackBar } from '@angular/material';

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
          },
        },
        MatSnackBar,
      ],
      declarations: [ProfileComponent],
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
