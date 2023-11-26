import { IsSubsequentDate } from '@common/decorators/is-subsequent-date.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class LeaseCreateDto {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  unitId: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  tenantId: string;

  @ApiProperty({ type: 'string', format: 'date', default: '2023-11-26' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  leaseStart: Date;

  @ApiProperty({ type: 'string', format: 'date', default: '2023-11-30' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsSubsequentDate('leaseStart', {
    message: 'Lease end date must be after lease start date',
  })
  leaseEnd: Date;
}

export class LeaseUpdateDto {
  @ApiProperty({ type: 'string', format: 'date', default: '2023-11-26' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  leaseStart: Date;

  @ApiProperty({ type: 'string', format: 'date', default: '2023-11-30' })
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsSubsequentDate('leaseStart', {
    message: 'Lease end date must be after lease start date',
  })
  leaseEnd: Date;
}
