import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { VerifyGeneratePasswordService } from '../verify-generate-password/verify-generate-password.service';
import { VerifyEmailComponent } from './verify-email.component';

describe('VerifyEmailComponent', () => {
  let component: VerifyEmailComponent;
  let fixture: ComponentFixture<VerifyEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyEmailComponent],
      imports: [RouterTestingModule, AuthServerMaterialModule],
      providers: [
        {
          provide: VerifyGeneratePasswordService,
          useValue: {
            verifyEmail: (...args) => of({}),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
