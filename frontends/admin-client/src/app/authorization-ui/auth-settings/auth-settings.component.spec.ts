import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSettingsComponent } from './auth-settings.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthSettingsService } from './auth-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthSettingsComponent', () => {
  let component: AuthSettingsComponent;
  let fixture: ComponentFixture<AuthSettingsComponent>;

  beforeEach(async(() => {
    spyOn(localStorage, 'getItem').and.callFake(key => '[]');

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
          provide: AuthSettingsService,
          useValue: {
            getSettings: (...args) => of([]),
            getClientList: (...args) => of([]),
            getBucketOptions: (...args) => of([]),
            getEmailAccounts: (...args) => of([]),
            getClientSettings: (...args) => of([]),
            getSavedEmailAccount: (...args) => of({}),
          },
        },
      ],
      declarations: [AuthSettingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
