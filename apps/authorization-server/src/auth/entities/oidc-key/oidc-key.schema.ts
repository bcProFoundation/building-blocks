import * as mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

function dateNow() {
  return new Date();
}

export const OIDCKey = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4 },
    keyPair: mongoose.Schema.Types.Mixed,
    creation: { type: Date, default: dateNow },
  },
  { collection: 'oidc_key', versionKey: false },
);

export const OIDC_KEY = 'OIDCKey';

export const OIDCKeyModel = mongoose.model(OIDC_KEY, OIDCKey);
