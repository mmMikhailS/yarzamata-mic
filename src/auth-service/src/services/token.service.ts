import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from '../repository/token.repository';

@Injectable()
export class TokenService {
  constructor(
    private jwt: JwtService,
    private tokenRepository: TokenRepository,
  ) {}

  async generateAccessToken(payload: { access: string }) {
    return this.jwt.sign(payload, {
      secret: 'fewfafiawjfiaf',
      expiresIn: '15m',
    });
  }

  async generateTokens(payload: any) {
    const refreshToken = this.jwt.sign(payload, {
      secret: 'fewfafiawjfiaf',
      expiresIn: '30d',
    });
    const accessToken = this.jwt.sign(payload, {
      secret: 'fewfafiawjfiafa',
      expiresIn: '30m',
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  async verify(refrsehToken: string) {
    return this.jwt.verifyAsync(refrsehToken, { secret: 'fewfafiawjfiaf' });
  }

  async createToken(refreshToken: string, userId: number) {
    return await this.tokenRepository.create(refreshToken, userId);
  }

  async updateToken(refreshToken: string, userId: number) {
    return await this.tokenRepository.update(refreshToken, userId);
  }

  async deleteAllTokens(userId: number) {
    return await this.tokenRepository.deleteAllTokens(userId);
  }
}
