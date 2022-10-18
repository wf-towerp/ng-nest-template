import {MigrationInterface, QueryRunner} from "typeorm";

export class myapp1666018546565 implements MigrationInterface {
    name = 'myapp1666018546565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL DEFAULT '', \`last_name\` varchar(255) NOT NULL DEFAULT '', \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL DEFAULT '', \`salt\` varchar(255) NOT NULL DEFAULT '', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`last_login\` timestamp NULL, \`prev_login\` timestamp NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
