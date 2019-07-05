import { ConnectedService } from './connected-service.interface';

export interface ServiceMessage {
  service: string;
  session: boolean;
  communication: boolean;
  services?: ConnectedService[];
  enableChoosingAccount?: boolean;
}
