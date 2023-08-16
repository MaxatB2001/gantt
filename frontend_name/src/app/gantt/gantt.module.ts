import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    GanttChartComponent
  ],
  imports: [
    CommonModule,
    GanttRoutingModule,
  ],
  exports: [GanttChartComponent]
})
export class GanttModule { }
