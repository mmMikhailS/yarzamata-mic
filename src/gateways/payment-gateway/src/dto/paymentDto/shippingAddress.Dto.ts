import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPostalCode,
  IsString,
} from 'class-validator';

class AddressDto {
  @IsString({ message: 'addressLine1 должен быть строкой.' })
  @IsNotEmpty({ message: 'addressLine1 не может быть пустым.' })
  addressLine1: string;

  @IsString({ message: 'addressLine2 должен быть строкой.' })
  @IsOptional()
  addressLine2?: string;

  @IsString({ message: 'adminArea1 должен быть строкой.' })
  @IsNotEmpty({ message: 'adminArea1 не может быть пустым.' })
  adminArea1: string; // Штат или регион

  @IsString({ message: 'adminArea2 должен быть строкой.' })
  @IsNotEmpty({ message: 'adminArea2 не может быть пустым.' })
  adminArea2: string; // Город

  @IsString({ message: 'postalCode должен быть строкой.' })
  @IsPostalCode('UA', {
    message:
      'postalCode должен соответствовать формату почтового индекса для Украины.',
  }) // Укажите нужный формат для вашей страны
  postalCode: string;

  @IsString({ message: 'countryCode должен быть строкой.' })
  @IsNotEmpty({ message: 'countryCode не может быть пустым.' })
  countryCode: string; // Код страны
}

class PhoneNumberDto {
  @IsString({ message: 'countryCode должен быть строкой.' })
  @IsNotEmpty({ message: 'countryCode не может быть пустым.' })
  countryCode: string; // Код страны

  @IsString({ message: 'nationalNumber должен быть строкой.' })
  @IsNotEmpty({ message: 'nationalNumber не может быть пустым.' })
  nationalNumber: string; // Номер телефона
}

export class ShippingAddressDto {
  @IsObject({ message: 'name должен быть объектом.' })
  @IsNotEmpty({ message: 'name не может быть пустым.' })
  name: {
    fullName: string; // Полное имя получателя
  };

  @IsObject({ message: 'address должен быть объектом.' })
  @IsNotEmpty({ message: 'address не может быть пустым.' })
  address: AddressDto;

  @IsObject({ message: 'phoneNumber должен быть объектом.' })
  @IsNotEmpty({ message: 'phoneNumber не может быть пустым.' })
  phoneNumber: PhoneNumberDto;
}
