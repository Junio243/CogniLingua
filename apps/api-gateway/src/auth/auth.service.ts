import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { UsersService } from './services/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(payload: RegisterDto) {
    const user = await this.usersService.createUser(
      payload.email,
      payload.password,
      payload.roles,
    );

    return this.buildTokens(user.id, user.email, user.roles.map((role) => role.name));
  }

  async login(payload: LoginDto) {
    const user = await this.usersService.findByEmail(payload.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isValid = await compare(payload.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.buildTokens(user.id, user.email, user.roles.map((role) => role.name));
  }

  async refreshTokens({ refreshToken }: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret:
          process.env.REFRESH_TOKEN_SECRET || 'cognilingua_refresh_secret',
      });

      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Token inválido');
      }

      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.refreshTokenHash) {
        throw new UnauthorizedException('Sessão expirada');
      }

      const isTokenValid = await compare(refreshToken, user.refreshTokenHash);

      if (!isTokenValid) {
        throw new UnauthorizedException('Token não reconhecido');
      }

      return this.buildTokens(user.id, user.email, user.roles.map((role) => role.name));
    } catch (error) {
      throw new UnauthorizedException('Não foi possível renovar a sessão');
    }
  }

  private async buildTokens(userId: string, email: string, roles: string[]) {
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      roles,
      tokenType: 'access',
    };

    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      roles,
      tokenType: 'refresh',
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: process.env.ACCESS_TOKEN_SECRET || 'cognilingua_access_secret',
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN ?? '15m') as any,
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: process.env.REFRESH_TOKEN_SECRET || 'cognilingua_refresh_secret',
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES_IN ?? '7d') as any,
      }),
    ]);

    const refreshTokenHash = await hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, refreshTokenHash);

    return { accessToken, refreshToken };
  }
}
