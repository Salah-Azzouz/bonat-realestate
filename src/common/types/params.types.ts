import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdFrompayload {
  @ApiProperty({ type: 'string' })
  @IsUUID()
  id: string;
}
