import { MigrationInterface, QueryRunner } from "typeorm";

export class initialCommit1679845182784 implements MigrationInterface {
    name = 'initialCommit1679845182784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "discipline" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "teacherId" uuid, CONSTRAINT "PK_139512aefbb11a5b2fa92696828" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teachers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7568c49a630907119e4a665c605" UNIQUE ("email"), CONSTRAINT "PK_a8d4f83be3abe4c687b0a0093c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assessments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "detail" character varying NOT NULL, "note" integer NOT NULL, "studentId" uuid, "teacherId" uuid, CONSTRAINT "PK_a3442bd80a00e9111cefca57f6c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "students" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "avatar" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_25985d58c714a4a427ced57507b" UNIQUE ("email"), CONSTRAINT "PK_7d7f07271ad4ce999880713f05e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "street" character varying NOT NULL, "city" character varying NOT NULL, "state" character varying NOT NULL, "number" integer NOT NULL, "cep" character varying NOT NULL, "teacherId" uuid, "studentId" uuid, CONSTRAINT "REL_69d57e2430bb309b1c952910dd" UNIQUE ("teacherId"), CONSTRAINT "REL_cc2d65ab99ebeef1fa3eeb7c5d" UNIQUE ("studentId"), CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curriculum" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "cpf" character varying NOT NULL, "formation" character varying, "skills" character varying, "professional_experience" character varying, "linkedin" character varying, "celullar" character varying, "resume" character varying, CONSTRAINT "UQ_ec889a0c57ee1abaf6b648164bb" UNIQUE ("cpf"), CONSTRAINT "PK_ea7cdfd52edbddc8d7352e2a747" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "discipline" ADD CONSTRAINT "FK_a43eb54f43b727ba350fa51f6df" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assessments" ADD CONSTRAINT "FK_0bedc1cc7c7242bf78246fbf4bd" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "assessments" ADD CONSTRAINT "FK_9c678788c729af235b440f7999b" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_69d57e2430bb309b1c952910dde" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "address" ADD CONSTRAINT "FK_cc2d65ab99ebeef1fa3eeb7c5db" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_cc2d65ab99ebeef1fa3eeb7c5db"`);
        await queryRunner.query(`ALTER TABLE "address" DROP CONSTRAINT "FK_69d57e2430bb309b1c952910dde"`);
        await queryRunner.query(`ALTER TABLE "assessments" DROP CONSTRAINT "FK_9c678788c729af235b440f7999b"`);
        await queryRunner.query(`ALTER TABLE "assessments" DROP CONSTRAINT "FK_0bedc1cc7c7242bf78246fbf4bd"`);
        await queryRunner.query(`ALTER TABLE "discipline" DROP CONSTRAINT "FK_a43eb54f43b727ba350fa51f6df"`);
        await queryRunner.query(`DROP TABLE "curriculum"`);
        await queryRunner.query(`DROP TABLE "address"`);
        await queryRunner.query(`DROP TABLE "students"`);
        await queryRunner.query(`DROP TABLE "assessments"`);
        await queryRunner.query(`DROP TABLE "teachers"`);
        await queryRunner.query(`DROP TABLE "discipline"`);
    }

}
