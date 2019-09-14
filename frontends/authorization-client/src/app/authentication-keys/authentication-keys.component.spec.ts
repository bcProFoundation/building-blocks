import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationKeysComponent } from './authentication-keys.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AuthenticationKeysService } from './authentication-keys.service';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';

describe('AuthenticationKeysComponent', () => {
  let component: AuthenticationKeysComponent;
  let fixture: ComponentFixture<AuthenticationKeysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        AuthServerMaterialModule,
      ],
      providers: [
        {
          provide: AuthenticationKeysService,
          useValue: {
            getAuthenticators: (...args) => of([]),
          },
        },
      ],
      declarations: [AuthenticationKeysComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationKeysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
