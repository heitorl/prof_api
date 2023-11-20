import { MigrationInterface, QueryRunner } from "typeorm";

export class initialCommit1698890107098 implements MigrationInterface {
    name = 'initialCommit1698890107098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" ADD "neighborhood" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "neighborhood"`);
    }

}
