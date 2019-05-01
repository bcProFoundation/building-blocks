import { CleanOauth2orizeSessionMiddleware } from './clean-oauth2orize-session.middleware';

describe('CleanOauth2orizeSessionMiddleware', () => {
  it('should be defined', () => {
    expect(new CleanOauth2orizeSessionMiddleware()).toBeDefined();
  });
});
