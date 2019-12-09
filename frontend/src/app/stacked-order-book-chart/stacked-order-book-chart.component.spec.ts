import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StackedOrderBookChartComponent } from './stacked-order-book-chart.component';

describe('StackedOrderBookChartComponent', () => {
  let component: StackedOrderBookChartComponent;
  let fixture: ComponentFixture<StackedOrderBookChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedOrderBookChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedOrderBookChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
