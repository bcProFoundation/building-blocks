import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APPS_TITLE } from '../../constants/messages';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.css'],
})
export class AppsComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit() {
    this.title.setTitle(APPS_TITLE);
  }
}
