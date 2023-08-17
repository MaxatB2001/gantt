import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttRoutingModule } from './gantt-routing.module';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import { SelectProjectComponent } from './components/select-project/select-project.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    GanttChartComponent,
    SelectProjectComponent
  ],
  imports: [
    CommonModule,
    GanttRoutingModule,
    MatButtonModule,
    MatDialogModule,
    MatCheckboxModule
  ],
  exports: [GanttChartComponent]
})
export class GanttModule { }
