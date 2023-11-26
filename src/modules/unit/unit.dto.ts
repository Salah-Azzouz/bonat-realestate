import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PropertyTypeEnum } from '@common/enums/property-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UnitPayloadDto {
  @ApiProperty({
    enum: PropertyTypeEnum,
    type: 'string',
  })
  @IsNotEmpty()
  @IsEnum(PropertyTypeEnum)
  type: PropertyTypeEnum;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  pricePerSquareMeter: number;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  numberOfRooms: number;
}

export class SearchForUnitsDto {
  @ApiProperty({
    enum: PropertyTypeEnum,
    type: 'string',
  })
  @IsNotEmpty()
  @IsEnum(PropertyTypeEnum)
  type: PropertyTypeEnum;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  minNumberOfRooms: number;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  maxNumberOfRooms: number;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  minPricePerSquareMeter: number;

  @ApiProperty({
    type: 'number',
    default: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  maxPricePerSquareMeter: number;
}
