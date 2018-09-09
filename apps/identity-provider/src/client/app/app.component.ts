import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: string = 'app';
  serverMessage: string;
  clientMessage: string = 'Angular 6';

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.getServerMessage();
  }

  getServerMessage(): void {
    this.appService
      .getMessage()
      .subscribe(response => (this.serverMessage = response.message));
  }
}
