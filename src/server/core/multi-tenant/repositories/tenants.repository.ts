import { Injectable, Logger } from '@nestjs/common';
import { DataSource, MigrationExecutor, MigrationInterface, MixedList, Repository } from 'typeorm';
import { TenantEntity } from '../entities';
import { InternalServerErrorException } from '@nestjs/common';
import { Tools } from '@common/tools.function';

@Injectable()
export class TenantsRepository extends Repository<TenantEntity> {

    logger: Logger = new Logger('Migrations');

    constructor(
        private _dataSource: DataSource,
    ) {
        super(TenantEntity, _dataSource.createEntityManager());
    }

    async ensureSchema(schema: string) {
        try {
            return await this._dataSource.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);
        } catch (error) {
            this.logger.error(`Error creating schema "${schema}"`);
            throw new InternalServerErrorException(error);
        }
    }

    async ensureMigrationsTable(schema: string, table_name: string) {
        try {
            return await this._dataSource.query(`CREATE TABLE IF NOT EXISTS ${schema}."${table_name}" ("id" SERIAL NOT NULL, "timestamp" bigint NOT NULL, "name" character varying NOT NULL DEFAULT '')`);
        } catch (error) {
            this.logger.error(`Error creating migrations table ${schema}."${table_name}"`);
            throw new InternalServerErrorException(error);
        }
    }

    /**
     * A fix for DataSource.runMigrations() method. It doesn't change schema as it is defined in the connection options
     * @param connection DataSource
     * @param migrations MixedList<string | Function> Array of migration classes
     */
    async runMigrations(connection: DataSource, migrations: MixedList<string | Function>) {
        if (migrations.length) {
            if (!connection.isInitialized)
                await connection.initialize();

            const tenant_name = connection.options['schema'];
            const qr = connection.createQueryRunner();
            await qr.query(`SET SCHEMA '${tenant_name}'`);

            const migrationExecutor = new MigrationExecutor(connection, qr);
            const successMigrations = await migrationExecutor.executePendingMigrations();

            if (!successMigrations.length)
                this.logger.log(`No new migrations for tenant "${tenant_name}"`);
            else
                this.logger.log(`Executed ${successMigrations.length} migration${successMigrations.length > 1 ? 's' : ''} on tenant "${tenant_name}"`);

            return successMigrations;
        }
    }

}
