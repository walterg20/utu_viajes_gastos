import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.POSGREST_HOST || 'localhost',
  port: parseInt(process.env.POSGREST_PORT || '5432', 10),
  username: process.env.POSGREST_USER || 'postgres',
  password: process.env.POSGREST_PASSWORD,
  database: process.env.POSGREST_DB || 'railway',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
