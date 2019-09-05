import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { OAuth2ScopeRemovedEvent } from './oauth2scope-removed.event';
import { ScopeService } from '../../entities/scope/scope.service';

@EventsHandler(OAuth2ScopeRemovedEvent)
export class OAuth2ScopeRemovedHandler
  implements IEventHandler<OAuth2ScopeRemovedEvent> {
  constructor(private readonly scope: ScopeService) {}

  handle(event: OAuth2ScopeRemovedEvent) {
    const { scope } = event;
    from(this.scope.remove(scope)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
