import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationSettingsComponent } from './communication-settings.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';
import { CommunicationSettingsService } from './communication-settings.service';

describe('CommunicationSettingsComponent', () => {
  let component: CommunicationSettingsComponent;
  let fixture: ComponentFixture<CommunicationSettingsComponent>;

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
          provide: CommunicationSettingsService,
          useValue: {
            getSettings: (...args) => of([]),
            getClientList: (...args) => of([]),
            getBucketOptions: (...args) => of([]),
            getEmailAccounts: (...args) => of([]),
            getClientSettings: (...args) => of([]),
            getSavedEmailAccount: (...args) => of({}),
          },
        },
        { provide: OAuthService, useValue: oauthServiceStub },
      ],
      declarations: [CommunicationSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
