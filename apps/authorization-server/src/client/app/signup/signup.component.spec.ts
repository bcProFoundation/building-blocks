import {
  async,
  ComponentFixture,
  TestBed,
  inject,
} from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { from } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let fixture: ComponentFixture<SignupComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        AuthService,
        HttpClient,
        HttpHandler,
        {
          provide: ActivatedRoute,
          useValue: { queryParams: from([{ redirect: '/account' }]) },
        },
      ],
      imports: [AuthServerMaterialModule, FormsModule, BrowserAnimationsModule],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
  });
  it('should create', async(
    inject([AuthService], (authService: AuthService) => {
      fixture = TestBed.createComponent(SignupComponent);
      const component: SignupComponent = fixture.componentInstance;
      expect(component).toBeTruthy();
    }),
  ));
});
