import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CloudStorageComponent } from './cloud-storage.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { CloudStorageService } from './cloud-storage.service';
import { of } from 'rxjs';

describe('CloudStorageComponent', () => {
  let component: CloudStorageComponent;
  let fixture: ComponentFixture<CloudStorageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CloudStorageComponent],
      imports: [
        HttpClientTestingModule,
        BrowserDynamicTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: CloudStorageService,
          useValue: {
            getCloud: (...args) => of({}),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: of({ uuid: 'new' }),
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
