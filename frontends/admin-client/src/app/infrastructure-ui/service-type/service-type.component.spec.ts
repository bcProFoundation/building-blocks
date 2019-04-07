import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceTypeComponent } from './service-type.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';
import { MessageService } from '../../common/services/message/message.service';
import { ServiceTypeService } from './service-type.service';
import { empty } from 'rxjs';

describe('ServiceTypeComponent', () => {
  let component: ServiceTypeComponent;
  let fixture: ComponentFixture<ServiceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [ServiceTypeComponent],
      providers: [
        HttpErrorHandler,
        MessageService,
        {
          provide: ServiceTypeService,
          useValue: {
            getServiceType: (...args) => empty(),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
