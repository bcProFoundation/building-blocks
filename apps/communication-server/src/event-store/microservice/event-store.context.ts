import { BaseRpcContext } from '@nestjs/microservices/ctx-host/base-rpc.context';

type EventStoreStream = string;
type EventStoreCtxArgs = [EventStoreStream];

export class EventStoreContext extends BaseRpcContext<EventStoreCtxArgs> {
  constructor(args: EventStoreCtxArgs) {
    super(args);
  }

  /**
   * Returns the underlying stream
   */
  getStreamName() {
    return this.args[0];
  }
}
