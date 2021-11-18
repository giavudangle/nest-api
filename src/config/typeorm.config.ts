import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export default class TypeOrmConfig {
    static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
        return {
            type: 'postgres',
            host: configService.get('POSTGRES_HOST'),
            port: configService.get('POSTGRES_PORT'),
            username: configService.get('POSTGRES_USER'),
            password: configService.get('POSTGRES_PASSWORD'),
            database: configService.get('POSTGRES_DB') ,
            //autoLoadEntities:true,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true, // based on enviroment (must false in production)
            logging: true,
            migrations:['src/migrations/*{.ts,.js}'],
            cli:{
                migrationsDir:'src/migrations'
            }
            
        }
    }
}

