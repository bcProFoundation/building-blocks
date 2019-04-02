import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComponent } from './client.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientService } from './client.service';
import { of, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OAuthService } from 'angular-oauth2-oidc';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { oauthServiceStub } from '../../common/testing-helpers';

describe('ClientComponent', () => {
  let component: ClientComponent;
  let fixture: ComponentFixture<ClientComponent>;

  const clientServiceStub: Partial<ClientService> = {
    getClient(id: string): Observable<any> {
      return of({
        clientID: id,
      });
    },
    getScopes(): Observable<any> {
      return of([{ name: 'openid' }, { name: 'email' }, { name: 'roles' }]);
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      declarations: [ClientComponent],
      providers: [
        {
          provide: ClientService,
          useValue: clientServiceStub,
        },
        {
          provide: OAuthService,
          useValue: oauthServiceStub,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: of({ id: 'new' }),
            },
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
