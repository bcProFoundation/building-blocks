import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardNavComponent } from './dashboard-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
import { MaterialModule } from '../material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';

describe('DashboardNavComponent', () => {
  let component: DashboardNavComponent;
  let fixture: ComponentFixture<DashboardNavComponent>;

  @Component({ selector: 'app-home', template: '' })
  class HomeComponent {}

  beforeEach(fakeAsync(() => {
    const oauthServiceStub: Partial<OAuthService> = {
      events: new Observable(),
      hasValidAccessToken: () => false,
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BrowserAnimationsModule, MaterialModule],
      declarations: [HomeComponent, DashboardNavComponent],
      providers: [
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeDefined();
  });
});
