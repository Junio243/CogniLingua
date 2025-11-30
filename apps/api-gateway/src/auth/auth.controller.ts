import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Cadastro de novo usuário' })
  register(@Body() payload: RegisterDto) {
    return this.authService.register(payload);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticação de usuário' })
  login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Atualização do token JWT' })
  refresh(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshTokens(payload);
  }
}
