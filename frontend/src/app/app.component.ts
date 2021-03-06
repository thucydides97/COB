/* Code for these charts based on:
*  https://www.amcharts.com/demos/live-order-book-depth-chart/?theme=dataviz
*/

import { Component, NgZone } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dataviz from "@amcharts/amcharts4/themes/animated";

// am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private chart: am4charts.XYChart;
  private exchanges = ['binance', 'bitfinex', 'poloniex', 'bittrex', 'kraken']//, 'kucoin', 'bitstamp'];
  private charts = {};

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.exchanges.forEach(ex => {

        this.charts[ex] = am4core.create("chartdiv_"+ex, am4charts.XYChart);
        let title = this.charts[ex].titles.create();
        title.text = ex;
        title.fontSize = 25;
        title.marginBottom = 30;

        // Add data
        this.charts[ex].dataSource.url = "http://209.97.187.180:5555/order_book?ex="+ex+"&s=BTC/USDT";
        this.charts[ex].dataSource.reloadFrequency = 30000;
        this.charts[ex].dataSource.adapter.add("parsedData", function(data) {

          // Function to process (sort and calculate cummulative volume)
          function processData(list, type, desc) {

            // Convert to data points
            for(var i = 0; i < list.length; i++) {
              list[i] = {
                value: Number(list[i][0]),
                volume: Number(list[i][1]),
              }
            }

            // Sort list just in case
            list.sort(function(a, b) {
              if (a.value > b.value) {
                return 1;
              }
              else if (a.value < b.value) {
                return -1;
              }
              else {
                return 0;
              }
            });

            // Calculate cummulative volume
            if (desc) {
              for(var i = list.length - 1; i >= 0; i--) {
                if (i < (list.length - 1)) {
                  list[i].totalvolume = list[i+1].totalvolume + list[i].volume;
                }
                else {
                  list[i].totalvolume = list[i].volume;
                }
                let dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                res.unshift(dp);
              }
            }
            else {
              for(var i = 0; i < list.length; i++) {
                if (i > 0) {
                  list[i].totalvolume = list[i-1].totalvolume + list[i].volume;
                }
                else {
                  list[i].totalvolume = list[i].volume;
                }
                let dp = {};
                dp["value"] = list[i].value;
                dp[type + "volume"] = list[i].volume;
                dp[type + "totalvolume"] = list[i].totalvolume;
                res.push(dp);
              }
            }

          }

          // Init
          let res = [];
          processData(data.bids, "bids", true);
          processData(data.asks, "asks", false);

          return res;
        });

        // Set up precision for numbers
        this.charts[ex].numberFormatter.numberFormat = "####.##";

        // Create axes
        let xAxis = this.charts[ex].xAxes.push(new am4charts.CategoryAxis());
        xAxis.dataFields.category = "value";
        //xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 100;
        xAxis.title.text = "Price";

        let yAxis = this.charts[ex].yAxes.push(new am4charts.ValueAxis());
        yAxis.title.text = "Volume";

        // Create series
        let series = this.charts[ex].series.push(new am4charts.StepLineSeries());
        series.dataFields.categoryX = "value";
        series.dataFields.valueY = "bidstotalvolume";
        series.strokeWidth = 2;
        series.stroke = am4core.color("#0f0");
        series.fill = series.stroke;
        series.fillOpacity = 0.1;
        series.tooltipText = "Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{bidsvolume}[/]"

        let series2 = this.charts[ex].series.push(new am4charts.StepLineSeries());
        series2.dataFields.categoryX = "value";
        series2.dataFields.valueY = "askstotalvolume";
        series2.strokeWidth = 2;
        series2.stroke = am4core.color("#f00");
        series2.fill = series2.stroke;
        series2.fillOpacity = 0.1;
        series2.tooltipText = "Ask: [bold]{categoryX}[/]\nTotal volume: [bold]{valueY}[/]\nVolume: [bold]{asksvolume}[/]"

        let series3 = this.charts[ex].series.push(new am4charts.ColumnSeries());
        series3.dataFields.categoryX = "value";
        series3.dataFields.valueY = "bidsvolume";
        series3.strokeWidth = 0;
        series3.fill = am4core.color("#000");
        series3.fillOpacity = 0.2;

        let series4 = this.charts[ex].series.push(new am4charts.ColumnSeries());
        series4.dataFields.categoryX = "value";
        series4.dataFields.valueY = "asksvolume";
        series4.strokeWidth = 0;
        series4.fill = am4core.color("#000");
        series4.fillOpacity = 0.2;

        // Add cursor
        this.charts[ex].cursor = new am4charts.XYCursor();
      });
    })

  }

  // ngOnDestroy() {
  //   this.zone.runOutsideAngular(() => {
  //     if (this.chart) {
  //       this.chart.dispose();
  //     }
  //   });
  // }
}
