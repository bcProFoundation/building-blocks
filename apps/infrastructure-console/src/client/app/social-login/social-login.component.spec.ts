import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginComponent } from './social-login.component';
import { MaterialModule } from '../material.module';
import { SocialLoginService } from './social-login.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SocialLoginComponent', () => {
  let component: SocialLoginComponent;
  let fixture: ComponentFixture<SocialLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [SocialLoginComponent],
      providers: [
        {
          provide: SocialLoginService,
          useValue: {},
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
