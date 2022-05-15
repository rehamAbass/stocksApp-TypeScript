import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
  
export class NasdaqService {

  constructor(private httpClient: HttpClient) { }
  getInfo() {
      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');
return this.httpClient.get('https://pkgstore.datahub.io/core/nasdaq-listings/nasdaq-listed_csv/data/7665719fb51081ba0bd834fde71ce822/nasdaq-listed_csv.csv',{responseType: 'text'});
  }
  //'./symbols.csv
  //https://datahub.io/core/nasdaq-listings/r/0.html
//{responseType: 'text'}

}


