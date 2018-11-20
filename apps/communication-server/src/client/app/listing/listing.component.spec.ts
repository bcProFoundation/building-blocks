import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingComponent } from './listing.component';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { OAuthService } from 'angular-oauth2-oidc';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { oauthServiceStub } from '../common/testing-helpers';
import { ListingService } from '../common/listing.service';
import { HttpErrorHandler } from '../http-error-handler.service';

describe('ListingComponent', () => {
  let component: ListingComponent;
  let fixture: ComponentFixture<ListingComponent>;

  @Component({ selector: 'app-home', template: '' })
  class HomeComponent {}

  const listingServiceStub: Partial<ListingService> = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: HomeComponent },
        ]),
        MaterialModule,
        BrowserAnimationsModule,
        MaterialModule,
        HttpClientTestingModule,
      ],
      declarations: [ListingComponent, HomeComponent],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
        {
          provide: ListingService,
          useValue: listingServiceStub,
        },
        {
          provide: HttpErrorHandler,
          useValue: {
            handleError<T>(...args) {},
            createHandleError(...args) {},
          },
        },
        MatSnackBar,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingComponent);
    component = fixture.componentInstance;
    component.dataSource = new MatTableDataSource();
    component.dataSource.data = [];
    component._skipLoading = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
