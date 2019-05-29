import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuth2ProviderComponent } from './oauth2-provider.component';
import { MaterialModule } from '../../shared-imports/material/material.module';
import { of } from 'rxjs';
import { OAuth2ProviderService } from './oauth2-provider.service';

describe('OAuth2ProviderComponent', () => {
  let component: OAuth2ProviderComponent;
  let fixture: ComponentFixture<OAuth2ProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
      declarations: [OAuth2ProviderComponent],
      providers: [
        {
          provide: OAuth2ProviderService,
          useValue: {
            getProvider: (...args) => of({}),
            generateRedirectURL: (...args) => '',
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OAuth2ProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
