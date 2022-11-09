import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmConfig } from '@server/config';
import { importAllFunctions } from '@server/tools';
import { ConnectionNotFoundError, DataSource, DataSourceOptions } from 'typeorm';
import { TenantsRepository } from '../repositories';

@Injectable()
export class TenantsService {

    logger: Logger = new Logger('Migrations');

    private _connections: { [key: string]: DataSource } = {};

    constructor(
        private _tenantsRepository: TenantsRepository
    ) {
        (async () => {
            const tenants = await this._tenantsRepository.find();

            if (tenants.length)
                this.logger.log(`Running migrations on ${tenants.length} tenant${tenants.length > 1 ? 's' : ''}: ${tenants.map(x => x.name).join(', ')}`);

            for (let tenant_idx = 0; tenant_idx < tenants.length; tenant_idx++) {
                const tenant = tenants[tenant_idx];

                await _tenantsRepository.ensureSchema(tenant.name);

                if (!this._connections[tenant.name]) {
                    const options = {
                        ...(TypeOrmConfig as DataSourceOptions),
                        name: tenant.name,
                        schema: tenant.name,
                        debug: true,
                        entities: [
                            ...importAllFunctions(require.context(`src/server/modules/`, true, /\.entity\.ts$/)),
                        ],
                        migrations: [
                            ...importAllFunctions(require.context(`src/server/migrations/tenants/`, true, /\.ts$/)),
                        ],
                    } as DataSourceOptions;

                    this._connections[tenant.name] = await new DataSource(options);
                    await this._connections[tenant.name].initialize();

                    if (options.migrations.length)
                        await this._tenantsRepository.runMigrations(this._connections[tenant.name], options.migrations);
                }
            }

        })();
    }

    async getConnection(tenant: string) {
        if (!this._connections[tenant])
            throw new ConnectionNotFoundError(`Connection for tenant "${tenant}" not found!`);

        if (!this._connections[tenant].isInitialized)
            await this._connections[tenant].initialize();

        return this._connections[tenant];
    }

}
