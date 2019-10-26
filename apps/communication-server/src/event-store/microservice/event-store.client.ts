import {
  ClientProxy,
  ReadPacket,
  WritePacket,
  PacketId,
} from '@nestjs/microservices';
import { TCPClient } from 'geteventstore-promise';
import { SERVICE } from '../../constants/app-strings';
import { ConfigService } from '../../config/config.service';

export class EventStoreClient extends ClientProxy {
  constructor(private readonly config: ConfigService) {
    super();
  }

  stream: string;
  connection: TCPClient;

  async connect() {
    this.init();
    await this.subscribeEvents();
  }

  async close() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  protected publish(
    partialPacket: ReadPacket,
    callback: (packet: WritePacket) => any,
  ) {
    try {
      const packet = this.assignPacketId(partialPacket);
      packet.pattern = packet.pattern.event;
      this.routingMap.set(packet.id, callback);
      this.processEvent(packet)
        .catch(err => callback({ err }))
        .then(response => callback({ response }));

      return () => this.routingMap.delete(packet.id);
    } catch (err) {
      callback({ err });
    }
  }

  protected async dispatchEvent(packet: ReadPacket): Promise<any> {
    return await this.processEvent(packet);
  }

  init() {
    const {
      hostname,
      username,
      password,
      stream,
    } = this.config.getEventStoreConfig();

    if (hostname && stream && username && password) {
      this.stream = stream;
      this.connection = new TCPClient({
        hostname,
        port: 1113,
        credentials: { username, password },
      });
    }
  }

  handleResponse(subscription, buffer: WritePacket & PacketId) {
    const { err, response, isDisposed, id } = buffer;
    const callback = this.routingMap.get(id);
    if (!callback) {
      return undefined;
    }
    if (isDisposed || err) {
      callback({
        err,
        response: null,
        isDisposed: true,
      });
    }
    callback({
      err,
      response,
    });
  }

  async subscribeEvents() {
    if (this.connection) {
      await this.connection.subscribeToStream(
        this.stream,
        this.handleResponse.bind(this),
      );
    }
  }

  protected async processEvent(packet: ReadPacket): Promise<any> {
    return await this.connection.writeEvent(
      this.stream,
      packet.pattern,
      packet.data,
      { service: SERVICE },
    );
  }
}
