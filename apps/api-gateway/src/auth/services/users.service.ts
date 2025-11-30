import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  async createUser(email: string, password: string, roles?: string[]): Promise<User> {
    const existingUser = await this.usersRepository.findOne({ where: { email } });

    if (existingUser) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    const passwordHash = await hash(password, 10);
    const rolesToAssign = await this.resolveRoles(roles);

    const user = this.usersRepository.create({
      email,
      passwordHash,
      roles: rolesToAssign,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: string, refreshTokenHash: string | null) {
    await this.usersRepository.update({ id: userId }, { refreshTokenHash });
  }

  private async resolveRoles(roleNames?: string[]): Promise<Role[]> {
    const names = roleNames?.length ? roleNames : ['user'];

    const roles = await Promise.all(
      names.map(async (name) => {
        let role = await this.rolesRepository.findOne({ where: { name } });

        if (!role) {
          role = this.rolesRepository.create({
            name,
            permissions: await this.createDefaultPermissions(name),
          });
          role = await this.rolesRepository.save(role);
        }

        return role;
      }),
    );

    return roles;
  }

  private async createDefaultPermissions(roleName: string): Promise<Permission[]> {
    const permissionNames =
      roleName === 'admin'
        ? ['manage_users', 'manage_content', 'view_content']
        : ['view_content'];

    const permissions: Permission[] = [];

    for (const name of permissionNames) {
      let permission = await this.permissionsRepository.findOne({ where: { name } });
      if (!permission) {
        permission = this.permissionsRepository.create({ name });
        permission = await this.permissionsRepository.save(permission);
      }
      permissions.push(permission);
    }

    return permissions;
  }
}
