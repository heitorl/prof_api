import { MigrationInterface, QueryRunner } from "typeorm";

export class createEntityNotification1701047702900 implements MigrationInterface {
    name = 'createEntityNotification1701047702900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "read" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "studentId" uuid, "teacherId" uuid, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_0aa7234f407f2b991cdf2e5afc2" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_460ec11855836dc28bed8c9e81a" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_460ec11855836dc28bed8c9e81a"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_0aa7234f407f2b991cdf2e5afc2"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
