'use strict';

import 'jest';
import { EnsureLoginGuard } from '../';

describe('EnsureLoginGuard', () => {
  it('Should be pass sanity', () => {
    expect(typeof EnsureLoginGuard).toBeDefined();
  });
});
