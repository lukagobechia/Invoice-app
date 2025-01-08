import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getToken } from './auth.guard';

@Injectable()
export class IsUser implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token)
      throw new UnauthorizedException('Unauthorized access: No token provided');

    try {
      const payload = await this.jwtService.verify(token);
      const role = payload.role;
      if (!role) throw new BadRequestException('Role is not provided');

      if (!['admin', 'user'].includes(role)) {
        throw new ForbiddenException('Access denied: Insufficient role');
      }

      request.role = payload.role;

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Unauthorized access: Invalid token');
    }
  }
}

@Injectable()
export class IsAdmin implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token) throw new UnauthorizedException('Unauthorized access');

    try {
      const payload = await this.jwtService.verify(token);
      const role = payload.role;
      if (!role) throw new BadRequestException('Role is not provided');

      if (!['admin'].includes(role)) {
        throw new ForbiddenException('Access denied: Insufficient role');
      }
      request.role = payload.role;

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Unauthorized access: Invalid token');
    }
  }
}
