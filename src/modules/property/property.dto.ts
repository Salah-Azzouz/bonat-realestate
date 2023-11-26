import { PropertyTypeEnum } from '@common/enums/property-type.enum';
import { IsNotEmptyArray } from '@common/decorators/no-empty-units.validator';
import { UnitPayloadDto } from '@modules/unit/unit.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PropertyCreateDto {
  @ApiProperty({
    example: 'Property 1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Jakarta',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: [
      {
        pricePerSquareMeter: 100000,
        numberOfRooms: 2,
        type: PropertyTypeEnum.APARTMENT,
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        pricePerSquareMeter: {
          type: 'number',
          example: 100000,
        },
        numberOfRooms: {
          type: 'number',
          example: 2,
        },
        type: {
          type: 'string',
          example: PropertyTypeEnum.APARTMENT,
        },
      },
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitPayloadDto)
  @IsNotEmptyArray()
  units: CreateUnitFromPropertyDto[];
}

export class PropertyUpdateDto {
  @ApiProperty({
    example: 'Property 1',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Jakarta',
    type: 'string',
  })
  @IsNotEmpty()
  @IsString()
  location: string;
}

export class AddUnitsToPropertyDto {
  @ApiProperty({
    example: [
      {
        pricePerSquareMeter: 100000,
        numberOfRooms: 2,
        type: PropertyTypeEnum.APARTMENT,
      },
    ],
    type: 'array',
    items: {
      type: 'object',
      properties: {
        pricePerSquareMeter: {
          type: 'number',
          example: 100000,
        },
        numberOfRooms: {
          type: 'number',
          example: 2,
        },
        type: {
          type: 'string',
          example: PropertyTypeEnum.APARTMENT,
        },
      },
    },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UnitPayloadDto)
  @IsNotEmptyArray()
  units: CreateUnitFromPropertyDto[];
}

export class CreateUnitFromPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  pricePerSquareMeter: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfRooms: number;

  @IsNotEmpty()
  @IsEnum(PropertyTypeEnum)
  type: PropertyTypeEnum;
}
