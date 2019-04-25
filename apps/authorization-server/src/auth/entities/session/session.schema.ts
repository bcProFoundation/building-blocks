import * as mongoose from 'mongoose';

export const Session = new mongoose.Schema(
  {},
  { collection: 'session', versionKey: false, strict: false },
);

export const SESSION = 'Session';

export const SessionModel = mongoose.model(SESSION, Session);
