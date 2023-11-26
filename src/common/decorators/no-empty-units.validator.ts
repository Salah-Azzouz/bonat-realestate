import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class IsNotEmptyArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value || !Array.isArray(value) || value.length === 0) {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must contain at least one item in the array`;
  }
}

export function IsNotEmptyArray(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyArray',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsNotEmptyArrayConstraint,
    });
  };
}
