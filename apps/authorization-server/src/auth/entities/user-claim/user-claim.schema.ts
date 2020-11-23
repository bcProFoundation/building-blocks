import * as mongoose from 'mongoose';

export const UserClaim = new mongoose.Schema(
  {
    claimId: { type: String, unique: true, required: true },
    uuid: String,
    scope: String,
    name: String,
    value: mongoose.Schema.Types.Mixed,
  },
  { collection: 'user_claim', versionKey: false },
);

export const USER_CLAIM = 'UserClaim';

export const UserClaimModel = mongoose.model(USER_CLAIM, UserClaim);
