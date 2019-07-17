import { Component, OnInit, Inject } from '@angular/core';
import { BrandInfoService } from '../common/brand-info/brand-info.service';
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
  primaryColor: string;
  accentColor: string;
  warnColor: string;

  constructor(
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private brandInfoService: BrandInfoService,
  ) {}

  ngOnInit() {
    this.getBrandInfo();
  }

  getBrandInfo() {
    this.brandInfoService.retrieveBrandInfo().subscribe({
      next: brand => {
        this.setColors(brand);
        this.setFavicon(brand);
        this.setURLs(brand);
        this.copyrightMessage = brand.copyrightMessage;
      },
      error: error => {},
    });
  }

  setFavicon(brand) {
    this.faviconURL = brand.faviconURL;
    if (this.faviconURL) {
      const nodeList = this._document.getElementsByTagName('link');
      for (const nodeIndex of Object.keys(nodeList)) {
        if (
          ['icon', 'shortcut_icon'].includes(
            nodeList[nodeIndex].getAttribute('rel'),
          )
        ) {
          nodeList[nodeIndex].setAttribute('href', this.faviconURL);
        }
      }
    }
  }

  setURLs(brand) {
    this.logoURL = brand.logoURL;
    this.termsURL = brand.termsURL;
    this.helpURL = brand.helpURL;
    this.privacyURL = brand.privacyURL;
  }

  setColors(brand) {
    this.primaryColor = brand.primaryColor;
    this.accentColor = brand.accentColor;
    this.warnColor = brand.warnColor;

    if (this.primaryColor) {
      this._document.body.style.setProperty(
        '--primary-color',
        this.primaryColor,
      );
    }

    if (this.accentColor) {
      this._document.body.style.setProperty('--accent-color', this.accentColor);
    }

    if (this.warnColor) {
      this._document.body.style.setProperty('--warn-color', this.warnColor);
    }
  }
}
