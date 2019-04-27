import { SaveDeviceInfoMiddleware } from './save-device-info.middleware';

describe('SaveDeviceInfoMiddleware', () => {
  it('should be defined', () => {
    expect(new SaveDeviceInfoMiddleware()).toBeDefined();
  });
});
