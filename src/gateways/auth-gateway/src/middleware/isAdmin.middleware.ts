import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class isAdminhMiddleware implements NestMiddleware {
  constructor(
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: any, res: Response, next: NextFunction) {
    const refreshToken = req.cookie['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('unauthorized user');

    const verifyToken = await this.jwt.verify(refreshToken);
    if (!verifyToken) throw new UnauthorizedException('Invalid token');

    const findUser = async (email: string) => {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    };

    const user = await findUser(verifyToken.email);
    if (!user) throw new UnauthorizedException('Unauthorized user');

    if (!user.isAdmin) {
      throw new BadRequestException('not enough rights');
    }

    req.user = verifyToken;
    next();
  }
}
