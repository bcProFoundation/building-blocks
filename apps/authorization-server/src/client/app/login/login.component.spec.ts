import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: { queryParams: from([{ redirect: '/account' }]) },
        },
      ],
      declarations: [LoginComponent],
      imports: [FormsModule, AuthServerMaterialModule, BrowserAnimationsModule],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
