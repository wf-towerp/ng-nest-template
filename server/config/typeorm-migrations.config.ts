import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { resolve, join } from 'path';
const env_path = resolve(process.cwd(), 'dist', 'ng-nest-template', 'config', '.env');

dotenv.config({
    path: env_path,
    encoding: 'utf8',
    debug: true,
    override: true
});

import { TypeOrmConfig } from './typeorm.config';

const TypeOrmConfigMigrations: TypeOrmModuleOptions = {
    ...TypeOrmConfig,
    entities: [
        join(__dirname, '..', '**', '*.entity{.ts,.js}'),
    ],
    migrations: [
        join(__dirname, '..', 'migrations', '**', '*{.ts,.js}')
    ],
    migrationsTableName: 'migrations',
    cli: {
        entitiesDir: 'server/**/*.entity{.ts,.js}',
        migrationsDir: 'server/migrations',
    }
}

export default TypeOrmConfigMigrations;
