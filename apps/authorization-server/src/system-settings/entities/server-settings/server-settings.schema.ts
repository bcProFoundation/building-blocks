import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const ServerSettings = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    issuerUrl: String,
    organizationName: String,
    communicationServerClientId: String,
    identityProviderClientId: String,
    infrastructureConsoleClientId: String,
    backupBucket: String,
    disableSignup: Boolean,
    otpExpiry: { type: Number, default: 5 },
    enableChoosingAccount: Boolean,
    refreshTokenExpiresInDays: { type: Number, default: 30 },
    authCodeExpiresInMinutes: { type: Number, default: 30 },
    enableUserPhone: { type: Boolean, default: false },
  },
  { collection: 'server_settings', versionKey: false },
);

export const SERVER_SETTINGS = 'ServerSettings';

export const ServerSettingsModel = mongoose.model(
  SERVER_SETTINGS,
  ServerSettings,
);
