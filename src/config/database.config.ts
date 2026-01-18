import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // Si Railway proporciona DATABASE_URL, usarla (tiene prioridad)
  if (process.env.DATABASE_URL) {
    return {
      type: 'postgres' as const,
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };
  }

  // Usar variables individuales (Railway también proporciona PGHOST, PGPORT, etc.)
  const host = process.env.PGHOST || process.env.POSGREST_HOST || 'localhost';
  const port = parseInt(process.env.PGPORT || process.env.POSGREST_PORT || '5432', 10);
  const username = process.env.PGUSER || process.env.POSGREST_USER || 'postgres';
  const password = process.env.PGPASSWORD || process.env.POSGREST_PASSWORD;
  const database = process.env.PGDATABASE || process.env.POSGREST_DB || 'railway';

  return {
    type: 'postgres' as const,
    host,
    port,
    username,
    password,
    database,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
});
