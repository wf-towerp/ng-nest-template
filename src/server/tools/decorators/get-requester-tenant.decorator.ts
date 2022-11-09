import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetRequesterTenant: any = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest();
        return (request?.headers.referer || request?.headers.origin)?.replace(/http(?:s)?:\/\//i, '').split('.')[0];
    }
);
