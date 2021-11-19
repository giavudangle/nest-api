import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiPropertyOptional()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
