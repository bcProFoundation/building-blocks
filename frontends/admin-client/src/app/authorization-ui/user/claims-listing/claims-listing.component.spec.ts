import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClaimsListingComponent } from './claims-listing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ClaimsListingService } from './claims-listing.service';
import { MaterialModule } from '../../../shared-imports/material/material.module';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

const listingService: Partial<ClaimsListingService> = {
  findClaims: (...args) => of([]),
};

describe('ClaimsListingComponent', () => {
  let component: ClaimsListingComponent;
  let fixture: ComponentFixture<ClaimsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ClaimsListingComponent],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        {
          provide: ClaimsListingService,
          useValue: listingService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
