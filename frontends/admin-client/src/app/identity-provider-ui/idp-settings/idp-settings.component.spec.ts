import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IdpSettingsComponent } from './idp-settings.component';
import { IdpSettingsService } from './idp-settings.service';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('IdpSettingsComponent', () => {
  let component: IdpSettingsComponent;
  let fixture: ComponentFixture<IdpSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: IdpSettingsService,
          useValue: {
            getSettings: (...args) => of([]),
            getClientList: (...args) => of([]),
            getBucketOptions: (...args) => of([]),
            getCloudStorages: (...args) => of([]),
            getClientSettings: (...args) => of([]),
            getSavedEmailAccount: (...args) => of({}),
          },
        },
        { provide: OAuthService, useValue: oauthServiceStub },
      ],
      declarations: [IdpSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdpSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
