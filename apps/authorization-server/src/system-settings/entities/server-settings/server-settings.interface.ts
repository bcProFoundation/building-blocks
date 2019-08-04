import { Document } from 'mongoose';

export interface ServerSettings extends Document {
  uuid?: string;
  issuerUrl?: string;
  communicationServerClientId?: string;
  identityProviderClientId?: string;
  infrastructureConsoleClientId?: string;
  backupBucket?: string;
  disableSignup?: boolean;
  otpExpiry?: number;
  enableChoosingAccount?: boolean;
  refreshTokenExpiresInDays?: number;
  authCodeExpiresInMinutes?: number;
}
