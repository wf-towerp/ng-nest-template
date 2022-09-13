import { Module } from '@nestjs/common';
import { AngularUniversalModule, InMemoryCacheStorage } from '@nestjs/ng-universal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppServerModule } from '../src/main.server';
import { DEFAULT_CACHE_EXPIRATION_TIME, STATIC_VIEWS_PATH, TypeOrmConfig } from '@server/config';
import { HelloWorldModule } from '@server/modules/hello-world';
import { UsersModule } from './modules/users';

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: STATIC_VIEWS_PATH,
            cache: {
                storage: new InMemoryCacheStorage(),
                expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
                // expiresIn: 24 * 60 * DEFAULT_CACHE_EXPIRATION_TIME, /* 24 hours */
            }
        }),
        TypeOrmModule.forRoot(TypeOrmConfig),
        HelloWorldModule,
        UsersModule,
    ]
})
export class AppModule { }
