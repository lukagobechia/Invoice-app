import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = getToken(request.headers);
    if (!token)
      throw new UnauthorizedException('Unauthorized access: No token provided');

    try {
      const payload = await this.jwtService.verify(token);
      request.userId = payload.userId;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('Unauthorized access: Invalid token');
    }
  }
}

export function getToken(headers: Record<string, any>): string | null {
  if (!headers['authorization']) {
    throw new UnauthorizedException('No authorization header provided');
  }
  const [type, token] = headers['authorization'].split(' ');

  return type === 'Bearer' ? token : null;
}
