import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { resolve, join } from 'path';
const env_path = resolve(process.cwd(), 'dist', 'config', '.env');

console.log(`Hello from typeorm-migrations.config.ts!!!`);

dotenv.config({
    path: env_path,
    encoding: 'utf8',
    override: true
});

import { TypeOrmConfig } from './typeorm.config';

const TypeOrmConfigMigrations: TypeOrmModuleOptions = {
    ...TypeOrmConfig,
    entities: [
        join(__dirname, '..', '**', '*.entity{.ts,.js}'),
    ],
    migrations: [
        join(__dirname, '..', 'migrations', '**', '*.{ts,js}'),
        // join(__dirname, '..', '..', 'migrations', '**', '*{.ts,.js}')
    ],
    migrationsTableName: 'migrations',
    // cli: {
    //     entitiesDir: 'src/server/**/*.entity{.ts,.js}',
    //     migrationsDir: 'src/migrations',
    // }
}

export default TypeOrmConfigMigrations;
