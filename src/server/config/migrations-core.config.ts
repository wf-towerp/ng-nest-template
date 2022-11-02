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

export const MigrationsCoreDataSource = new DataSource({
    ...(TypeOrmConfig as DataSourceOptions),
    entities: [
        join(process.cwd(), 'src', 'server', 'core', '**', '*.entity.{ts,js}'),
    ],
    migrations: [
        `src/server/migrations/core/**/*.{ts,js}`,
    ],
});
