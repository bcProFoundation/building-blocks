import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandInfoComponent } from './brand-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BrandInfoComponent', () => {
  let component: BrandInfoComponent;
  let fixture: ComponentFixture<BrandInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [BrandInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
