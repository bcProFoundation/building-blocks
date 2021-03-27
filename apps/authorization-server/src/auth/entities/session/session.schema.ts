import mongoose from 'mongoose';

export const SESSION_COLLECTION = 'session';

export const Session = new mongoose.Schema(
  {},
  { collection: SESSION_COLLECTION, versionKey: false, strict: false },
);

export const SESSION = 'Session';

export const SessionModel = mongoose.model(SESSION, Session);
