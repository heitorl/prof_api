import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableMessage1701034868807 implements MigrationInterface {
    name = 'createTableMessage1701034868807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderStudentId" uuid, "senderTeacherId" uuid, "receiverStudentId" uuid, "receiverTeacherId" uuid, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_3be81bd2ec474548b17d66fab86" FOREIGN KEY ("senderStudentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_90e20ca4fe168eb595ce3337247" FOREIGN KEY ("senderTeacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_ba0960198275fb3028deb76f588" FOREIGN KEY ("receiverStudentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_98cbe1264e11a9e6c8d18509d4e" FOREIGN KEY ("receiverTeacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_98cbe1264e11a9e6c8d18509d4e"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_ba0960198275fb3028deb76f588"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_90e20ca4fe168eb595ce3337247"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_3be81bd2ec474548b17d66fab86"`);
        await queryRunner.query(`DROP TABLE "messages"`);
    }

}
