import dotenv from 'dotenv';
import { resolve } from 'path';
const env_path = resolve(__dirname, `../config/.env`);

dotenv.config({
    path: env_path,
    encoding: 'utf8',
    debug: false,
    override: true
});

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import express from 'express';
import { STATIC_UPLOADS_PATH } from '@server/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.setGlobalPrefix('api');
    app.use('/public', express.static(STATIC_UPLOADS_PATH));
    app.useGlobalPipes(new ValidationPipe({
        transform: true
    }));
    app.use(cookieParser());

    await app.listen(process.env['PORT'] || process.env['APP_PORT'] || 3000);
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
    bootstrap().catch(err => console.error(err));
}
