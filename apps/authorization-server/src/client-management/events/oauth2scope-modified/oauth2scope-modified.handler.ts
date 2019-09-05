import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { from } from 'rxjs';
import { OAuth2ScopeModifiedEvent } from './oauth2scope-modified.event';
import { ScopeService } from '../../entities/scope/scope.service';

@EventsHandler(OAuth2ScopeModifiedEvent)
export class OAuth2ScopeModifiedHandler
  implements IEventHandler<OAuth2ScopeModifiedEvent> {
  constructor(private readonly scope: ScopeService) {}

  handle(event: OAuth2ScopeModifiedEvent) {
    const { scope } = event;
    from(this.scope.save(scope)).subscribe({
      next: success => {},
      error: error => {},
    });
  }
}
