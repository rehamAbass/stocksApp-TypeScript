import { Component, OnInit } from '@angular/core';
import { StocksService } from '../services/stocks.service';
import { NasdaqService } from '../services/serviceGetSymbolsSvc/nasdaq.service'
import { ChangeDetectionStrategy } from '@angular/core';
// import {ScrollingModule} from '@angular/cdk/scrolling';
declare var Highcharts: any;
import Swal from 'sweetalert2';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  NgModel,
} from '@angular/forms';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
// import { ConsoleReporter } from 'jasmine';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'angular9~Reham';
  stockForm: FormGroup;
  selectForm = FormGroup;
  StockList: Array<any>;
  Error: boolean = false;
  stocksInGraph: Array<{ id: string; name: string; data: Array<number> }> = [];
  maxStocksInChart = 6;
  firstSearch = "Foreign_exchange_market";
  symbolsArray: Array<{ "symbol": string, "name": string }> = []; //all symbols of the stocks
  filteredSymbols: Array<{ "symbol": string, "name": string }> = [];
 

  valueSelected = NgModel;
  constructor(
    private formBuilder: FormBuilder,
    private stocksService: StocksService,
      private nasdaqService: NasdaqService,
  ) {
    this.stockForm = formBuilder.group({
      search: ['', [Validators.required]],
    });
  }
  //---------------------------------------------------------------
    readCSVfile() { 
      this.nasdaqService.getInfo().subscribe((res) => {
        let lines = res.split("\n");
        lines = lines.slice(1);
        lines.forEach(l => {
          let oneStockDetails = l.split(",");
          let s = oneStockDetails[0];
          let n = oneStockDetails[1];
          this.symbolsArray.push({"symbol": s, "name": n });
        })
      });
      this.filteredSymbols = this.symbolsArray.map(p=>p)
    }
  //-----------------------------------------------------------
   _filter(sub: string){
    sub = sub.toLowerCase();
     return this.symbolsArray.filter(s => s.symbol.toLowerCase().startsWith(sub));
   }
  //-------------------------------------------------------------------
  addToSearch() { 
    // let st = this.selectedSymbol;
    // console.log("selected form = ", st);
    console.log("selected value = ...........................");
    // this.selectForm.valueChanges.subscribe(res => {
    //   let x = res['search']; 
    //   ConsoleReporter.log("x = ",x);
    // })

  }
 //---------------------------------------------------
  async ngOnInit() { 
      await this.readCSVfile();
      let timerInterval
    Swal.fire({
  title: ' Reham`s Stocks App',
      text: ' ~ TypeScript',
  //  html: '<b></b> milliseconds.',
      timerProgressBar: true,
      timer: 2800,
        imageUrl:'https://previews.123rf.com/images/dalebor/dalebor1612/dalebor161200019/69006359-%E9%9B%84%E7%89%9B%E3%81%A8%E8%A8%80%E8%91%89%E5%A4%96%E5%9B%BD%E7%82%BA%E6%9B%BF%E3%81%AE%E3%82%B7%E3%83%AB%E3%82%A8%E3%83%83%E3%83%88%E3%80%82%E3%83%99%E3%82%AF%E3%83%88%E3%83%AB%E3%81%AE%E5%9B%B3%E3%80%82.jpg',
      padding: '0em',
      color: `gold`,
      background: `#000`,

    showConfirmButton:false,
  backdrop: `rgba(120,120,120,0.55)`,
  didOpen: () => {
    Swal.showLoading()
    const b = Swal.getHtmlContainer().querySelector('b')
    timerInterval = setInterval(() => {
      b.textContent = Swal.getTimerLeft().toString()
    }, 500);
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */
  if (result.dismiss === Swal.DismissReason.timer) {
    // console.log('I was closed by the timer')
  }
})
  }
//------------------------------------------------------------------------------
 
  reham() { 
    console.log("hello reham");
  }

  //----------------------------------------------------------------------------

  touched() {
    this.stockForm.valueChanges.subscribe(res => {
      let sub = res['search']; 
      if (sub.includes(',')) {
        let arr = sub.split(',');
        sub = arr[arr.length - 1];
      }
        this.filteredSymbols = this._filter(sub);
    })
  }
//=========================================================================================
  drawGraph() {
    Highcharts.chart('container2', {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Stocks',
      },
      xAxis: {
        categories: ['low', 'high'],
      },
      credits: {
        enabled: false,
      },
      series: this.stocksInGraph,
    });
  }
  //=====================================================================================
  reachedMaxStocks = false;
  emptyChart = true;
  showMessageReachedMax() {
    if(this.reachedMaxStocks == false){
      if (this.stocksInGraph.length === (this.maxStocksInChart)) {
        Swal.fire({
          icon: "warning",
          iconColor:'purple',
          title: "✅ Succeded to Add stock ,but can not add more stocks to chart",
          text: "reached maximum stocks (6) in chart!",
        })
        this.reachedMaxStocks = true;
      }
    }
    return;  
  }
  //=====================================================================================
  isInsideGraph(stock) {
    if (this.stocksInGraph.find((s) => s.id === stock.symbol)) {
      return true;
    }
    else { 
      return false;
    }
  }
//=============================================================================================
  remove(elem) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
        padding: '3em',
        color: '#716add',
        backdrop: `rgba(0,20,200,0.75)`
        // backdrop: `rgba(250,, 137, 0.45)`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          
          this.stocksInGraph = this.stocksInGraph.filter((e) => e.id !== elem.symbol);
          this.drawGraph();
          swalWithBootstrapButtons.fire(
            {
              title: 'Deleted!😔 ',
              text: 'Your stock has been deleted.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }
          );
        } else if (
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your stock still appears in the chart :)',
            'error'
          );
        }
      });
    this.reachedMaxStocks = false;
  }
//========================================================================================================
 add(stock) {
      Swal.fire({
        icon: "success",
        title: stock.shortName + "",
        text: "✅ Success to add stock to Chart!",
        showConfirmButton: false,
        timer: 1100,
        position: 'top'
      });
      this.stocksInGraph.push({
        id: stock.symbol,
        name: stock.shortName,
        data: [
          ((stock.regularMarketPreviousClose - stock.fiftyTwoWeekLow) * 100) /
          stock.fiftyTwoWeekLow,
          ((stock.regularMarketPreviousClose - stock.fiftyTwoWeekHigh) * 100) /
          stock.fiftyTwoWeekHigh,
        ],
      });
   this.emptyChart = false;
      this.drawGraph();
        this.showMessageReachedMax();
    }
  // }
//=====================================================================================================
    errorMsg(title,txt) {
      Swal.fire({
        icon: "error",
        title: title,
        text: txt,
        backdrop: `rgba(0,0,0,0.7)`,
        iconColor: `rgba(100,0,100,0.7)`,
      })
    }
  //==================================================================================================
//   fetching() { 
//     this.search();
//     let timerInterval;
//      Swal.fire({
//        title: 'Click search again',
//    html: '<b></b> milliseconds.',
//       timerProgressBar: true,
//       timer: 800,
//       padding: '0em',
//       color: `#3ff3f`,
//       background: `#f5f`,
//     showConfirmButton:true,
//  backdrop: `rgba(100,20,105,0.9)`,
//   didOpen: () => {
//     Swal.showLoading()
//     const b = Swal.getHtmlContainer().querySelector('b')
//     timerInterval = setInterval(() => {
//       b.textContent = Swal.getTimerLeft().toString()
//     }, 1000);
//   },
//   willClose: () => {
//     clearInterval(timerInterval)
//   }
// })
//   }

  //======================================================================================================

  search() {
    let input = this.stockForm.value.search;
      this.stocksService
        .getStocks(input)
        .subscribe((res) => {
          //  this.waitting();
          if (!res['quoteResponse'].error) {
            this.StockList = res['quoteResponse'].result;
            if (!this.StockList.length)
              this.errorMsg('Error can not fetch data from API!','');
            this.StockList.forEach(st => {
              if (st.shortName == undefined) { 
                this.errorMsg('','One stock at least  does not exist!')
              }
            });
             this.StockList = this.StockList.filter((s) => s.shortName !== undefined);
            this.stocksInGraph = [];
          } else {
            this.Error = true;
            this.errorMsg("NO info found!","");
          }
        });
    }
  }
//------------------------------------------------------------------------------------------------------
//   'https://bsmedia.business-standard.com/_media/bs/img/misc/2020-12/17/full/market-markets-stock-market-stock-stocks-rise-stock-rally-1608188452-80872620.jpg',
//        'https://fxlmwpmedia.s3.amazonaws.com/wp-content/uploads/2019/02/25150152/usa-2661656_1280-852x485.jpg',

//------------------------------------------------------------------------------------------