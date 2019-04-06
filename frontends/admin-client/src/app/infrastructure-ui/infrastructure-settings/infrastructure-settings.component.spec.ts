import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureSettingsComponent } from './infrastructure-settings.component';
import { InfrastructureSettingsService } from './infrastructure-settings.service';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('InfrastructureSettingsComponent', () => {
  let component: InfrastructureSettingsComponent;
  let fixture: ComponentFixture<InfrastructureSettingsComponent>;

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
          provide: InfrastructureSettingsService,
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
      declarations: [InfrastructureSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
