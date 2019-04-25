import { SystemSettingsChangedHandler } from './server-settings-changed/server-settings-changed.handler';
import { BearerTokensDeletedHandler } from './bearer-tokens-deleted/bearer-tokens-deleted.handler';
import { UserSessionsDeletedHandler } from './user-sessions-deleted/user-sessions-deleted.handler';

export const SystemSettingsEventHandlers = [
  SystemSettingsChangedHandler,
  BearerTokensDeletedHandler,
  UserSessionsDeletedHandler,
];
