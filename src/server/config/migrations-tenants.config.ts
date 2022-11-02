import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { resolve, join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
const env_path = resolve(process.cwd(), 'dist', 'config', '.env');

dotenv.config({
    path: env_path,
    encoding: 'utf8',
    debug: false,
    override: true
});

import { TypeOrmConfig } from './typeorm.config';

export const MigrationsTenantDataSource = new DataSource({
    ...(TypeOrmConfig as DataSourceOptions),
    logging: ['log', 'migration'],
    entities: [
        join(process.cwd(), 'src', 'server', 'modules', '**', '*.entity.{ts,js}'),
        // `src/server/modules/**/*.entity.ts`
    ],
    migrations: [
        `src/migrations/tenants/**/*.{ts,js}`,
    ],
});
