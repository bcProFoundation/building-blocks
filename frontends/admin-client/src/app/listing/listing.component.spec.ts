import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ListingComponent } from './listing.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ListingService } from '../common/listing.service';
import { MaterialModule } from '../material.module';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

const listingService: Partial<ListingService> = {
  findModels: (...args) => of([]),
};

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListingComponent],
      imports: [
        NoopAnimationsModule,
        MaterialModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        {
          provide: ListingService,
          useValue: listingService,
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
