import { Component, OnInit } from '@angular/core';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {DataService} from "../data.service";

am4core.useTheme(am4themes_animated);


@Component({
  selector: 'app-stacked-order-book-chart',
  templateUrl: './stacked-order-book-chart.component.html',
  styleUrls: ['./stacked-order-book-chart.component.scss']
})
export class StackedOrderBookChartComponent implements OnInit {
  private exchanges = ['binance', 'bitfinex', 'poloniex', 'bittrex', 'kraken', 'kucoin']//, 'bitstamp'];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getChart();
  }

  getChart() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    // chart.dataSource.url = "http://127.0.0.1:50 00/order_book?ex=GLOBAL";
    // chart.dataSource.reloadFrequency = 5000;

    this.dataService.getGlobalOB()
      .subscribe(resp => {
            chart.data = resp['data']
      });

    let xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    xAxis.dataFields.category = "price";
    //xAxis.renderer.grid.template.location = 0;
    xAxis.renderer.minGridDistance = 100;
    xAxis.title.text = "Price";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let seriesList = {}
    this.exchanges.forEach(ex => {
      seriesList[ex] = chart.series.push(new am4charts.LineSeries());
      seriesList[ex].dataFields.categoryX = "price";
      seriesList[ex].name = ex;
      seriesList[ex].dataFields.valueY = ex;
      // seriesList[ex].tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
      seriesList[ex].tooltipText = "[#000]" + ex + " [#000]{valueY.value}[/]";
      seriesList[ex].tooltip.background.fill = am4core.color("#FFF");
      seriesList[ex].tooltip.getStrokeFromObject = true;
      seriesList[ex].tooltip.background.strokeWidth = 3;
      seriesList[ex].tooltip.getFillFromObject = false;
      seriesList[ex].fillOpacity = 0.6;
      seriesList[ex].strokeWidth = 2;
      seriesList[ex].stacked = true;
    });

    // let series = chart.series.push(new am4charts.LineSeries());
    // series.dataFields.categoryX = "price";
    // series.name = "binance";
    // series.dataFields.valueY = "binance";
    // // series.tooltipHTML = "<img src='https://www.amcharts.com/lib/3/images/car.png' style='vertical-align:bottom; margin-right: 10px; width:28px; height:21px;'><span style='font-size:14px; color:#000000;'><b>{valueY.value}</b></span>";
    // series.tooltipText = "[#000]{valueY.value}[/]";
    // series.tooltip.background.fill = am4core.color("#FFF");
    // series.tooltip.getStrokeFromObject = true;
    // series.tooltip.background.strokeWidth = 3;
    // series.tooltip.getFillFromObject = false;
    // series.fillOpacity = 0.6;
    // series.strokeWidth = 2;
    // series.stacked = true;


    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = xAxis;
    chart.scrollbarX = new am4core.Scrollbar();

    // Add a legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = "top";

    // axis ranges
    let range = xAxis.axisRanges.create();
    // range.date = new Date(2001, 0, 1);
    // range.endDate = new Date(2003, 0, 1);
    range.axisFill.fill = chart.colors.getIndex(7);
    range.axisFill.fillOpacity = 0.2;

    let range2 = xAxis.axisRanges.create();
    // range2.date = new Date(2007, 0, 1);
    range2.grid.stroke = chart.colors.getIndex(7);
    range2.grid.strokeOpacity = 0.6;
    range2.grid.strokeDasharray = "5,2";

    // setInterval(function() {
    //   this.dataService.getGlobalOB()
    //   .subscribe(resp => {
    //         chart.data = resp['data']
    //   });
    // }.bind(this), 10000);
  }

}
