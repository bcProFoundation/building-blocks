import * as mongoose from 'mongoose';

export const Session = new mongoose.Schema(
  {
    sid: String,
    expiresAt: Number,
    cookie: String,
    passport: String,
    authorize: String,
    user: String,
  },
  { collection: 'session', versionKey: false },
);

export const SESSION = 'Session';

export const SessionModel = mongoose.model(SESSION, Session);
