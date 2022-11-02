import { Module } from '@nestjs/common';
import { AngularUniversalModule, InMemoryCacheStorage } from '@nestjs/ng-universal';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppServerModule } from '../browser/main.server';
import { DEFAULT_CACHE_EXPIRATION_TIME, STATIC_VIEWS_PATH, TypeOrmConfig } from '@server/config';
import { HelloWorldModule } from '@server/modules/hello-world';
import { UsersModule } from './modules/users';
import { CoreModule } from './core/core.module';

@Module({
    imports: [
        AngularUniversalModule.forRoot({
            bootstrap: AppServerModule,
            viewsPath: STATIC_VIEWS_PATH,
            cache: {
                storage: new InMemoryCacheStorage(),
                expiresIn: DEFAULT_CACHE_EXPIRATION_TIME,
            }
        }),
        TypeOrmModule.forRoot(TypeOrmConfig),
        HelloWorldModule,
        UsersModule,
        CoreModule,
    ]
})
export class AppModule { }
