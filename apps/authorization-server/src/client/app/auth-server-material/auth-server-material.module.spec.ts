import { AuthServerMaterialModule } from './auth-server-material.module';

describe('AuthServerMaterialModule', () => {
  let authServerMaterialModule: AuthServerMaterialModule;

  beforeEach(() => {
    authServerMaterialModule = new AuthServerMaterialModule();
  });

  it('should create an instance', () => {
    expect(authServerMaterialModule).toBeTruthy();
  });
});
