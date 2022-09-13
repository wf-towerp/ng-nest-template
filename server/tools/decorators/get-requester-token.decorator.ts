import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetRequesterToken: any = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return (request?.cookies?.['auth'] || request?.headers?.auth || '').replace('Bearer ', '');
    }
);
