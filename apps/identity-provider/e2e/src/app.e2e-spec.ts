import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should route to login', () => {
    page.navigateTo();
    //expect(page.getParagraphText()).toEqual('Welcome to angular-tour-of-heroes!');
    expect(browser.getCurrentUrl()).toEqual('http://localhost:4200/login');
  });
});
