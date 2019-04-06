import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceComponent } from './service.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';
import { MessageService } from '../../common/services/message/message.service';
import { ServiceService } from './service.service';
import { empty } from 'rxjs';

describe('ServiceComponent', () => {
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        HttpErrorHandler,
        MessageService,
        {
          provide: ServiceService,
          useValue: {
            getClientList: (...args) => empty(),
            getService: (...args) => empty(),
          },
        },
      ],
      declarations: [ServiceComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
