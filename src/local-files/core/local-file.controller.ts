import { ClassSerializerInterceptor, Controller, UseInterceptors } from "@nestjs/common";

@Controller('local-files')
@UseInterceptors(ClassSerializerInterceptor)
export class LocalFilesController{
    
}