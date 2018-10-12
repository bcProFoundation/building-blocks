import * as amqp from 'amqplib';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { Buffer } from 'buffer';

export class RabbitMQClient extends ClientProxy {
  server: amqp.Connection;
  channel: amqp.Channel;
  constructor(private readonly host: string, private readonly queue: string) {
    super();
  }

  async connect(): Promise<any> {
    this.server = await amqp.connect(this.host);
    this.channel = await this.server.createChannel();
  }

  close() {
    this.server.close();
  }

  publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ) {
    const { sub, pub } = this.getQueues();
    this.channel.assertQueue(sub, { durable: true });
    this.channel.assertQueue(pub, { durable: true });
    this.channel.consume(
      pub,
      message => this.handleMessage(message, callback),
      { noAck: true },
    );
    this.channel.sendToQueue(sub, Buffer.from(JSON.stringify(packet)));
  }

  private handleMessage(
    message,
    callback: (err, response, isDisposed) => void,
  ) {
    const { content } = message;
    const { err, response, isDisposed } = JSON.parse(content.toString());
    callback(err, response, isDisposed);
  }

  getQueues() {
    return { pub: `${this.queue}_pub`, sub: `${this.queue}_sub` };
  }
}
