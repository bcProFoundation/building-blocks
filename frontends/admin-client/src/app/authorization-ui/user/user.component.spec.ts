import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { HttpErrorHandler } from '../../common/services/http-error-handler/http-error-handler.service';
import { MessageService } from '../../common/services/message/message.service';
import { oauthServiceStub } from '../../common/testing-helpers';

@Component({
  selector: 'claims-listing',
  template: '',
})
export class ClaimsListingComponent {
  @Input('uuid') uuid: string;
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      providers: [
        HttpErrorHandler,
        MessageService,
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
      ],
      declarations: [UserComponent, ClaimsListingComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
