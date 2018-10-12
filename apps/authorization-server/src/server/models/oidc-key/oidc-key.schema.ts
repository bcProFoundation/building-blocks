import * as mongoose from 'mongoose';
import * as uuidv4 from 'uuid/v4';

export const OIDCKey = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    keyPair: mongoose.Schema.Types.Mixed,
  },
  { collection: 'oidc_key', versionKey: false },
);

export const OIDC_KEY = 'OIDCKey';

export const OIDCKeyModel = mongoose.model(OIDC_KEY, OIDCKey);
