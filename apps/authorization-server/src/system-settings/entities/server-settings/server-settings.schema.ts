import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const ServerSettings = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    issuerUrl: String,
    communicationServerClientId: String,
    identityProviderClientId: String,
    infrastructureConsoleClientId: String,
    backupBucket: String,
    disableSignup: Boolean,
    otpExpiry: { type: Number, default: 5 },
    enableChoosingAccount: Boolean,
    refreshTokenExpiresInDays: { type: Number, default: 30 },
    authCodeExpiresInMinutes: { type: Number, default: 30 },
  },
  { collection: 'server_settings', versionKey: false },
);

export const SERVER_SETTINGS = 'ServerSettings';

export const ServerSettingsModel = mongoose.model(
  SERVER_SETTINGS,
  ServerSettings,
);
