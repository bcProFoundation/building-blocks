import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRequirementComponent } from './password-requirement.component';

describe('PasswordRequirementComponent', () => {
  let component: PasswordRequirementComponent;
  let fixture: ComponentFixture<PasswordRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordRequirementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
