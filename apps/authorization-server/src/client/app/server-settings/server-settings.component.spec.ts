import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSettingsComponent } from './server-settings.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServerSettingsService } from './server-settings.service';
import { from } from 'rxjs';

describe('ServerSettingsComponent', () => {
  let component: ServerSettingsComponent;
  let fixture: ComponentFixture<ServerSettingsComponent>;
  let stubServerSettingsService: Partial<ServerSettingsService>;
  beforeEach(async(() => {
    stubServerSettingsService = {
      get: () => {
        return from([]);
      },
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: ServerSettingsService, useValue: stubServerSettingsService },
      ],
      declarations: [ServerSettingsComponent],
      imports: [FormsModule, AuthServerMaterialModule, BrowserAnimationsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
