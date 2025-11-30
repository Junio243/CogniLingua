import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { UsersService } from './services/users.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [UsersService],
})
export class AuthModule {}
