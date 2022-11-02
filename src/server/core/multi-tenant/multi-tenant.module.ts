import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities';
import { TenantsRepository } from './repositories';
import { TenantsService } from './services';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            TenantEntity,
        ]),
    ],
    providers: [
        TenantsRepository,
        TenantsService,
    ],
    exports: [
        TenantsRepository,
        TenantsService,
    ],
})
export class MultiTenantModule { }
