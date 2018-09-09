import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let fixture: ComponentFixture<SignupComponent>;
  const authServiceStub: Partial<AuthService> = {};
  let component: SignupComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceStub, // mock values
        },
      ],
      imports: [AuthServerMaterialModule, FormsModule, BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
