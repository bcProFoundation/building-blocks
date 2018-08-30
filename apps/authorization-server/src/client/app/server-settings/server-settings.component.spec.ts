import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerSettingsComponent } from './server-settings.component';
import { AuthServerMaterialModule } from '../auth-server-material/auth-server-material.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ServerSettingsService } from './server-settings.service';
import { AuthService } from '../auth/auth.service';

describe('ServerSettingsComponent', () => {
  let component: ServerSettingsComponent;
  let fixture: ComponentFixture<ServerSettingsComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, ServerSettingsService, HttpClient, HttpHandler],
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
