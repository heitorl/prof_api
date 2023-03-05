import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class alterUserAddAvatar1676509140002 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('teachers', new TableColumn({
            name: "avatar",
            type: "varchar",
            isNullable: true
        }))
        await queryRunner.addColumn('students', new TableColumn({
            name: "avatar",
            type: "varchar",
            isNullable: true
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("teachers", "avatar")
        await queryRunner.dropColumn("students", "avatar")
    }

}
