import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class StocksService {
  constructor(private httpClient: HttpClient) {}

  //paramters: 'FB,AAPL'
  getStocks(parameters: string) {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      // .set('Access-Control-Allow-Origin', '*')
      // .set('Access-Control-Allow-Credentials', 'true');

      .set('X-RapidAPI-Host', 'yh-finance.p.rapidapi.com')
      .set('X-RapidAPI-Key', '78902fb637msh224990667c48a20p178cd0jsnf5b4c97c76b9');
    
    let params = new HttpParams();
    params = params.append('symbols', parameters);
    return this.httpClient.get(
      // 'https://query1.finance.yahoo.com/v7/finance/quote',
      // 'https://query1.finance.yahoo.com/v7/finance/quote?symbols='
      'https://thingproxy.freeboard.io/fetch/https://query1.finance.yahoo.com/v7/finance/quote',
      {
        headers: headers,
        params: params,
      }
    //  'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=10&exchange=NASDAQ',
     
    );
  }
}
