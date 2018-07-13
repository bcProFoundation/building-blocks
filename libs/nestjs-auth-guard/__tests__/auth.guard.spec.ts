import 'jest';
import { AuthGuard } from '../';

describe('AuthGuard', () => {
  it('Should be pass sanity', () => {
    expect(AuthGuard).toBeDefined();
  });
});
