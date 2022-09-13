import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const typeormConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env['APP_DB_HOST'],
    port: process.env['APP_DB_PORT'] && !isNaN(+process.env['APP_DB_PORT']) ? +process.env['APP_DB_PORT'] : 3306,
    database: process.env['APP_DB_NAME'],
    username: process.env['APP_DB_USER'],
    password: process.env['APP_DB_PASSWORD'],
    synchronize: false,
    migrationsRun: true,
    logging: ['error'],
    autoLoadEntities: true,
    entities: [
        join(__dirname, '..', '**', '*.entity{.ts,.js}'),
    ],
    migrations: [
        'server/migrations',
    ],
    migrationsTableName: 'migrations',
};

export const TypeOrmConfig: TypeOrmModuleOptions = typeormConfig;
