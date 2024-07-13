import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, Role } from '../utils';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<object> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            throw new BadRequestException('Role is not defined');
        }

        const req = context.switchToHttp().getRequest();

        const user = req.authUser
        if (!user || !user.role) {
            throw new BadRequestException('User is not defined, please login first');
        }

        const hasRole = requiredRoles.some((role) => user.role?.includes(role));
        if (!hasRole) {
            throw new BadRequestException('You do not have permission to access this resource');
        }

        return req
    }
}
