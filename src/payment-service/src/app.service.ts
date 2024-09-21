import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShippingAddressDto } from './dto/paymentDto/shippingAddress.Dto';
import { ProductDto } from './dto/paymentDto/paymentProducts.dto';

@Injectable()
export class AppService {
  private readonly PAYPAL_API_BASE_URL =
    process.env.PAYPAL_API_BASE_URL || 'https://api-m.sandbox.paypal.com';

  constructor() {}

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
    ).toString('base64');

    const response = await fetch(
      `${this.PAYPAL_API_BASE_URL}/v1/oauth2/token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          response_type: 'id_token',
          intent: 'sdk_init',
        }),
      },
    );
    console.log(response);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch access token:', errorText);
      throw new InternalServerErrorException(
        `Failed to get access token: ${response.statusText}`,
      );
    }

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(
    shippingAddress: ShippingAddressDto,
    product: ProductDto[],
  ) {
    const url = `${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders`;
    const accessToken = await this.getAccessToken();
    console.log(product);
    const totalValue = product.reduce(
      (acc, item) => acc + +item.unit_amount.value * +item.quantity,
      0,
    );
    console.log(totalValue);
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: product.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: item.unit_amount.currency_code,
              value: item.unit_amount.value.toString(),
            },
          })),
          amount: {
            currency_code: 'USD',
            value: totalValue.toString(),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: totalValue.toString(),
              },
            },
          },
          shipping: {
            name: {
              full_name: shippingAddress?.name?.fullName,
            },
            address: {
              address_line_1: shippingAddress?.address?.addressLine1,
              address_line_2: shippingAddress?.address?.addressLine2,
              admin_area_2: shippingAddress?.address?.adminArea2,
              admin_area_1: shippingAddress?.address?.adminArea1,
              postal_code: shippingAddress?.address?.postalCode,
              country_code: shippingAddress?.address?.countryCode,
            },
            phone_number: {
              country_code: shippingAddress?.phoneNumber?.countryCode,
              national_number: shippingAddress?.phoneNumber?.nationalNumber,
            },
          },
        },
      ],
    };
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new InternalServerErrorException(
        `Failed to create order: ${errorText}`,
      );
    }

    return await response.json();
  }
}
