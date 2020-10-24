import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserAuthenticatorRemovedEvent } from './user-authenticator-removed.event';
import { from, forkJoin } from 'rxjs';
import { AuthDataService } from '../../../user-management/entities/auth-data/auth-data.service';
import { AuthDataType } from '../../../user-management/entities/auth-data/auth-data.interface';
import { USER } from '../../../user-management/entities/user/user.schema';
import { UserAuthenticatorService } from '../../../user-management/entities/user-authenticator/user-authenticator.service';

@EventsHandler(UserAuthenticatorRemovedEvent)
export class UserAuthenticatorRemovedHandler
  implements IEventHandler<UserAuthenticatorRemovedEvent> {
  constructor(
    private readonly authData: AuthDataService,
    private readonly authenticator: UserAuthenticatorService,
  ) {}
  handle(event: UserAuthenticatorRemovedEvent) {
    const { authKey } = event;
    forkJoin(
      from(
        this.authData.deleteMany({
          authDataType: AuthDataType.Challenge,
          entityUuid: authKey?.userUuid,
          entity: USER,
        }),
      ),
      from(this.authenticator.remove(authKey)),
    ).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
