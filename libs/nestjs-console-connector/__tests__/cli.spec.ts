'use strict';

import 'jest';
import { createUserCLI, createIDPClientCLI } from '../src';

describe('createUserCLI', () => {
  it('Should be pass sanity', () => {
    expect(typeof createUserCLI).toBe('function');
  });
});

describe('createIDPClientCLI', () => {
  it('Should be pass sanity', () => {
    expect(typeof createIDPClientCLI).toBe('function');
  });
});
