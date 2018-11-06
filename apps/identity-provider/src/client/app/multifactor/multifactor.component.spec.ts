import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultifactorComponent } from './multifactor.component';
import { MaterialModule } from '../material.module';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../profile/profile.service';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../common/testing-helpers';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MultifactorComponent', () => {
  let component: MultifactorComponent;
  let fixture: ComponentFixture<MultifactorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [MultifactorComponent],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getAuthServerUser() {
              return of({});
            },
          },
        },
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultifactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
