import {MigrationInterface, QueryRunner} from "typeorm";

export class test1637836803558 implements MigrationInterface {
    name = 'test1637836803558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD "image_url" character varying NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "image_url"
        `);
    }

}
