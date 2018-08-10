'use strict';

import 'jest';
import { AccountManager } from '../src';

describe('AccountManager', () => {
  it('Should be pass sanity', () => {
    expect(typeof AccountManager).toBeDefined();
  });
});
