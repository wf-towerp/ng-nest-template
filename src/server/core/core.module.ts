import { Module } from '@nestjs/common';
import { MultiTenantModule } from './multi-tenant/multi-tenant.module';

@Module({
    imports: [
        MultiTenantModule,
    ]
})
export class CoreModule { }
