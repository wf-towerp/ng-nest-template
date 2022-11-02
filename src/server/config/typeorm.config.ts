import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const typeormConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env['APP_DB_HOST'],
    port: process.env['APP_DB_PORT'] && !isNaN(+process.env['APP_DB_PORT']) ? +process.env['APP_DB_PORT'] : 3306,
    database: process.env['APP_DB_NAME'],
    username: process.env['APP_DB_USER'],
    password: process.env['APP_DB_PASSWORD'],
    synchronize: false,
    logging: ['log', 'info', 'error'],
    schema: 'public',
    autoLoadEntities: true,
    entities: [
        join(__dirname, '..', '**', '*.entity.{ts,js}'),
        // `dist/server/**/*.entity.ts`,
        // ...importAllFunctions(`src/server/modules/**/*.entity.ts`)
    ],
    // migrationsRun: true,
    migrationsTableName: 'migrations',
    migrations: [
        // join(__dirname, '..', 'migrations', '**', '*.{ts,js}'),
        // `src/migrations/core/**/*.{ts,js}`,
        // `dist/migrations/core/**/*.{ts,js}`,
    ],
};

export const TypeOrmConfig: TypeOrmModuleOptions = typeormConfig;
