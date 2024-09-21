import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService) {}

  async use(req: any, res: Response, next: NextFunction) {
    const refreshToken = req.cookie['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('unauthorized user');

    const verifyToken = await this.jwt.verify(refreshToken);
    if (!verifyToken) throw new UnauthorizedException('Invalid token');
    req.refreshToken = refreshToken;
    next();
  }
}
