import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ChooseAccountComponent } from './choose-account.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChooseAccountComponent', () => {
  let component: ChooseAccountComponent;
  let fixture: ComponentFixture<ChooseAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseAccountComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        AuthServerMaterialModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
