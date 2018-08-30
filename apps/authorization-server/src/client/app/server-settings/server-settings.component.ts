import { Component, OnInit } from '@angular/core';
import { ServerSettingsService } from './server-settings.service';
import { ServerSettings } from './server-settings';

@Component({
  selector: 'app-server-settings',
  templateUrl: './server-settings.component.html',
  styleUrls: ['./server-settings.component.css'],
})
export class ServerSettingsComponent implements OnInit {
  settings: ServerSettings = new ServerSettings();

  constructor(private settingsService: ServerSettingsService) {}

  ngOnInit() {
    this.settingsService.get().subscribe({
      next: (response: any) => {
        if (response) this.settings = response;
      },
    });
  }

  onSubmit() {
    this.settingsService.save(this.settings).subscribe({
      next: (response: any) => {
        if (response) this.settings = response;
      },
    });
  }
}
