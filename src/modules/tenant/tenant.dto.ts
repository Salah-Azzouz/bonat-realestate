import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TenantCreateDto {
  @ApiProperty({
    description: 'The name of the tenant',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The contact information of the tenant',
    example: ' +1 123 456 7890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;
}
