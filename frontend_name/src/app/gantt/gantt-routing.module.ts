import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GanttChartComponent } from './components/gantt-chart/gantt-chart.component';
import { KeycloakAuthGuard } from 'keycloak-angular';

const routes: Routes = [{path: "/", component: GanttChartComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttRoutingModule { }
