import { ChangeServerSettingsHandler } from './change-server-settings/change-server-settings.handler';
import { DeleteBearerTokensHandler } from './delete-bearer-tokens/delete-bearer-tokens.handler';
import { DeleteUserSessionsHandler } from './delete-user-sessions/delete-user-sessions.handler';
import { SetupServerHandler } from './setup-server/setup-server.handler';

export const SystemSettingsCommandHandlers = [
  ChangeServerSettingsHandler,
  DeleteBearerTokensHandler,
  DeleteUserSessionsHandler,
  SetupServerHandler,
];
