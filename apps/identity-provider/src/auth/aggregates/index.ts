import { ClientTokenManagerService } from './client-token-manager/client-token-manager.service';
import { ConnectedDeviceService } from './connected-device/connected-device.service';

export const AuthAggregates = [
  ClientTokenManagerService,
  ConnectedDeviceService,
];
