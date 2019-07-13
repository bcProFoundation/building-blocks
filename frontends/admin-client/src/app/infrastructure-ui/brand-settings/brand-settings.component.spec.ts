import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { BrandSettingsComponent } from './brand-settings.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { BrandSettingsService } from './brand-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('BrandSettingsComponent', () => {
  let component: BrandSettingsComponent;
  let fixture: ComponentFixture<BrandSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [BrandSettingsComponent],
      providers: [
        {
          provide: BrandSettingsService,
          useValue: {
            updateSettings: (...args) => of({}),
            retrieveSettings: (...args) => of({}),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
