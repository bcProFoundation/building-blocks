import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyGeneratePasswordComponent } from './verify-generate-password.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('VerifyGeneratePasswordComponent', () => {
  let component: VerifyGeneratePasswordComponent;
  let fixture: ComponentFixture<VerifyGeneratePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AuthServerMaterialModule,
        RouterTestingModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [VerifyGeneratePasswordComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyGeneratePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
