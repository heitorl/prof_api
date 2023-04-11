import { MigrationInterface, QueryRunner } from "typeorm";

export class initialCommit21679846012107 implements MigrationInterface {
    name = 'initialCommit21679846012107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teachers" ALTER COLUMN "avatar" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "avatar" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "students" ALTER COLUMN "avatar" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teachers" ALTER COLUMN "avatar" SET NOT NULL`);
    }

}
