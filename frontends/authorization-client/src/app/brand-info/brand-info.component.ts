import { Component, OnInit, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BrandInfoService } from '../common/brand-info/brand-info.service';
import { ACCOUNTS } from '../constants/messages';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-brand-info',
  templateUrl: './brand-info.component.html',
  styleUrls: ['./brand-info.component.css'],
})
export class BrandInfoComponent implements OnInit {
  logoURL: string;
  privacyURL: string;
  helpURL: string;
  termsURL: string;
  faviconURL: string;
  copyrightMessage: string;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private brandInfoService: BrandInfoService,
    private title: Title,
  ) {}

  ngOnInit() {
    this.getBrandInfo();
  }

  getBrandInfo() {
    this.brandInfoService.retrieveBrandInfo().subscribe({
      next: brand => {
        this.logoURL = brand.logoURL;
        this.privacyURL = brand.privacyURL;
        this.helpURL = brand.helpURL;
        this.termsURL = brand.termsURL;
        this.faviconURL = brand.faviconURL;
        this.copyrightMessage = brand.copyrightMessage;
        if (this.copyrightMessage) {
          this.title.setTitle(ACCOUNTS + ' - ' + this.copyrightMessage);
        }
        if (this.faviconURL) {
          this.setFavicon(this.faviconURL);
        }
      },
      error: error => {},
    });
  }

  setFavicon(faviconURL: string) {
    const nodeList = this._document.getElementsByTagName('link');
    for (const nodeIndex of Object.keys(nodeList)) {
      if (nodeList[nodeIndex].getAttribute('rel') === 'icon') {
        nodeList[nodeIndex].setAttribute('href', faviconURL);
      }
    }
  }
}
