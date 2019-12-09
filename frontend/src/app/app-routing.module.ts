import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {StackedOrderBookChartComponent} from "./stacked-order-book-chart/stacked-order-book-chart.component";


const routes: Routes = [
  {path: 'global', component: StackedOrderBookChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
