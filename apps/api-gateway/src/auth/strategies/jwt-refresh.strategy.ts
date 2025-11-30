import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_TOKEN_SECRET || 'cognilingua_refresh_secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token ausente');
    }

    return { ...payload, refreshToken };
  }
}
