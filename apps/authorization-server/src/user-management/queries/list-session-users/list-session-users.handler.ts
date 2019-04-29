import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { ListSessionUsersQuery } from './list-session-users.query';

export const sessionUsersKey = 'users';

@QueryHandler(ListSessionUsersQuery)
export class ListSessionUsersHandler implements IQueryHandler {
  async execute(query: ListSessionUsersQuery) {
    const { request } = query;
    return request.session[sessionUsersKey] || [];
  }
}
