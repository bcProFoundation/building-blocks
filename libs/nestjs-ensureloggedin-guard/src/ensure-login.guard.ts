import { CanActivate, ExecutionContext } from '@nestjs/common';

export class EnsureLoginGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        if (!request.isAuthenticated || !request.isAuthenticated()) {
            if (request.session) {
              request.session.returnTo = request.originalUrl || request.url;
            }
            return false;
        }
        return true;
    }
}
