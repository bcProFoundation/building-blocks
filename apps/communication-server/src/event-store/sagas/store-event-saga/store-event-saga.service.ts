import { Injectable } from '@nestjs/common';
import { Saga, ICommand } from '@nestjs/cqrs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SaveEventCommand } from '../../commands/save-event/save-event.command';

@Injectable()
export class StoreEventSagaService {
  @Saga()
  fireEvent(events$: Observable<any>): Observable<ICommand> {
    return events$.pipe(map(event => new SaveEventCommand(event)));
  }
}
