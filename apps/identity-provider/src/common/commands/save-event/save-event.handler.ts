import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ClientMqtt } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SaveEventCommand } from './save-event.command';
import { BROADCAST_EVENT } from '../../events-microservice.client';
import { SERVICE } from '../../../constants/app-strings';

@CommandHandler(SaveEventCommand)
export class SaveEventHandler implements ICommandHandler<SaveEventCommand> {
  constructor(
    @Inject(BROADCAST_EVENT)
    private readonly publisher: ClientMqtt,
  ) {}

  async execute(command: SaveEventCommand) {
    const { event } = command;
    const payload = {
      eventId: uuidv4(),
      eventName: event.constructor.name,
      eventFromService: SERVICE,
      eventDateTime: new Date(),
      eventData: event,
    };
    this.publisher.emit(event.constructor.name, payload);
  }
}
