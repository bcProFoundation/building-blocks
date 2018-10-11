import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsComponent } from './clients.component';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBar, MatTableDataSource } from '@angular/material';
import { ClientService } from '../client/client.service';
import { from, Observable } from 'rxjs';
import { OAuthService } from 'angular-oauth2-oidc';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;

  @Component({ selector: 'app-home', template: '' })
  class HomeComponent {}

  const oauthServiceStub: Partial<OAuthService> = {
    getIdentityClaims() {
      return { roles: ['administrator'] };
    },
  };

  const clientServiceStub: Partial<ClientService> = {
    getClients(size?: number, index?: number, value?: string): Observable<any> {
      return from([
        { name: 'Identity Provider' },
        { name: 'Developer Console' },
      ]);
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: HomeComponent },
        ]),
        MaterialModule,
        BrowserAnimationsModule,
        MaterialModule,
      ],
      declarations: [ClientsComponent, HomeComponent],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
        {
          provide: ClientService,
          useValue: clientServiceStub,
        },
        MatSnackBar,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientsComponent);
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
