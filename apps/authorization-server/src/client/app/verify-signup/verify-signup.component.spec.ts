import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifySignupComponent } from './verify-signup.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VerifySignupComponent', () => {
  let component: VerifySignupComponent;
  let fixture: ComponentFixture<VerifySignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthServerMaterialModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [VerifySignupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
