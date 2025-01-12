import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { format } from 'date-fns';

@Injectable()
export class ExchangeRatesService {
    private baseUrl = 'http://api.exchangeratesapi.io/v1';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getLatestRates(base: string, symbols: string): Promise<any> {
    const url = `${this.baseUrl}/latest`;
    const params = {
      access_key: this.configService.get<string>('EXCHANGERATES_API_KEY'),
      base,
      symbols,
    };

    const response = this.httpService.get(url, { params });
    const result = await lastValueFrom(response).then((res) => res.data);
    return `
        <html>
        <head>
            <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
            }
            </style>
        </head>
        <body>
            <div class="container">
            <h1>Exchange Rates</h1>
            <p>Latest Exchange Rates</p>
            <p>Base Currency: ${base}</p>
            <p>Date: ${format(new Date(result.date), 'MMMM d, yyyy')}</p>
            <p>Rates for: ${symbols || 'All Currencies'}</p>
            <ul>
            ${Object.keys(result.rates)
            .map((key) => `<li>${key}: ${result.rates[key]}</li>`)
            .join('')}
            </ul>
            </div>
        </body>
        </html>
    `;
  }
}
