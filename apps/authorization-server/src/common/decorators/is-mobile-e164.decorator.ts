import { registerDecorator, ValidationOptions } from 'class-validator';

export const IS_MOBILEE164_TOKEN = 'isMobileE164';
export function IsMobileE164(validationOptions?: ValidationOptions) {
  return (object: unknown, propertyName: string) => {
    registerDecorator({
      name: IS_MOBILEE164_TOKEN,
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return /^\+(?:[0-9]?){6,14}[0-9]$/.test(value);
        },
      },
    });
  };
}
