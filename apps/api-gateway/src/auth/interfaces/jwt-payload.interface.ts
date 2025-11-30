export interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
  tokenType: 'access' | 'refresh';
}
