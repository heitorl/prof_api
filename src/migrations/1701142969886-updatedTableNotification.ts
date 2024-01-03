import { MigrationInterface, QueryRunner } from "typeorm";

export class updatedTableNotification1701142969886 implements MigrationInterface {
    name = 'updatedTableNotification1701142969886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_0aa7234f407f2b991cdf2e5afc2"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_460ec11855836dc28bed8c9e81a"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "studentId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "teacherId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "senderStudentId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "senderTeacherId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "receiverStudentId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "receiverTeacherId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_4a4c30b7f6204e5e6a23ea3e32c" FOREIGN KEY ("senderStudentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_992cf46f6beaff2296381e56e88" FOREIGN KEY ("senderTeacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_092e0516156a989da9667729ac0" FOREIGN KEY ("receiverStudentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_2217111dae43f6394fde85c3c13" FOREIGN KEY ("receiverTeacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_2217111dae43f6394fde85c3c13"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_092e0516156a989da9667729ac0"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_992cf46f6beaff2296381e56e88"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_4a4c30b7f6204e5e6a23ea3e32c"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "receiverTeacherId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "receiverStudentId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "senderTeacherId"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "senderStudentId"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "teacherId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "studentId" uuid`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_460ec11855836dc28bed8c9e81a" FOREIGN KEY ("teacherId") REFERENCES "teachers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_0aa7234f407f2b991cdf2e5afc2" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
