import { Document } from 'mongoose';

export interface ServerSettings extends Document {
  uuid?: string;
  issuerUrl?: string;
  communicationServerClientId: string;
}
