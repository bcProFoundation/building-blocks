import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { OAuth2ScopeAddedEvent } from './oauth2scope-added.event';
import { ScopeService } from '../../entities/scope/scope.service';

@EventsHandler(OAuth2ScopeAddedEvent)
export class OAuth2ScopeAddedHandler
  implements IEventHandler<OAuth2ScopeAddedEvent> {
  constructor(private readonly scope: ScopeService) {}

  handle(event: OAuth2ScopeAddedEvent) {
    const { scope } = event;
    from(this.scope.save(scope)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
