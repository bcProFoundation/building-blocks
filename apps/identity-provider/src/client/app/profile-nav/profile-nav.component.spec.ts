import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileNavComponent } from './profile-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs';

describe('ProfileNavComponent', () => {
  let component: ProfileNavComponent;
  let fixture: ComponentFixture<ProfileNavComponent>;

  beforeEach(fakeAsync(() => {
    const oauthServiceStub: Partial<OAuthService> = {
      events: new Observable(),
      hasValidAccessToken: () => false,
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ProfileNavComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeDefined();
  });
});
