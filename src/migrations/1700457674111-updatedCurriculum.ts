import { MigrationInterface, QueryRunner } from "typeorm";

export class updatedCurriculum1700457674111 implements MigrationInterface {
    name = 'updatedCurriculum1700457674111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculum" DROP CONSTRAINT "UQ_ec889a0c57ee1abaf6b648164bb"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "cpf"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "skills"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "linkedin"`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "formation"`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "formation" json`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "professional_experience"`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "professional_experience" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "professional_experience"`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "professional_experience" character varying`);
        await queryRunner.query(`ALTER TABLE "curriculum" DROP COLUMN "formation"`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "formation" character varying`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "linkedin" character varying`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "skills" character varying`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD "cpf" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "curriculum" ADD CONSTRAINT "UQ_ec889a0c57ee1abaf6b648164bb" UNIQUE ("cpf")`);
    }

}
