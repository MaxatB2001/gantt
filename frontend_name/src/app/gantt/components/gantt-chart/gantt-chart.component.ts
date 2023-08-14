import { Component, ElementRef, ViewChild } from '@angular/core';
import {} from "dhtmlx-gantt"
import "dhtmlx-gantt";
// import "dhtmlx-gantt/codebas"
declare let gantt: any;

var task = {
  data:[
  {id:1, text:"Project #1",start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.6, open: true},
  {id:2, text:"Task #1",   start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 1,   open: true, parent:1},
  {id:3, text:"Task #2",   start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.5, open: true, parent:1},
  {id:4, text:"Task #2.1", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 1,   open: true, parent:3},
  {id:5, text:"Task #2.2", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.8, open: true, parent:3},
  {id:6, text:"Task #2.3", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.2, open: true, parent:3}
  ],
  links:[
  {id:1, source:1, target:2, type:"1"},
  {id:2, source:1, target:3, type:"1"},
  {id:3, source:3, target:4, type:"1"},
  {id:4, source:4, target:5, type:"0"},
  {id:5, source:5, target:6, type:"0"}
  ]
};

@Component({
  selector: 'gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent {
  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  ngOnInit(){

    gantt.plugins({
      tooltip: true,
      quick_info: true
    })

    // gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
	gantt.config.bar_height = 16;
	gantt.config.row_height = 40;
  gantt.locale.labels.section_baseline = "Planned";
  gantt.locale.labels.baseline_enable_button = 'Set';
  gantt.locale.labels.baseline_disable_button = 'Remove';

  gantt.config.lightbox.sections = [
		{name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
		{name: "time", map_to: "auto", type: "duration"},
		{
			name: "baseline",
			map_to: {start_date: "planned_start", end_date: "planned_end"},
			button: true,
			type: "duration_optional"
		}
	];
  
    gantt.addTaskLayer({
      renderer: {
        render: function draw_planned(task: any) {
          console.log("ADD LAYER");
          
          if (task.planned_start && task.planned_end) {
            var sizes = gantt.getTaskPosition(task, task.planned_start, task.planned_end);
            var el = document.createElement('div');
            el.className = 'baseline';
            el.style.left = sizes.left + 'px';
            el.style.width = sizes.width + 'px';
            el.style.top = sizes.top + gantt.config.bar_height + 13 + 'px';
            return el;
          }
          return false;
        },
        // define getRectangle in order to hook layer with the smart rendering
        getRectangle: function(task: any, view: any){
          if (task.planned_start && task.planned_end) {
            return gantt.getTaskPosition(task, task.planned_start, task.planned_end);
          }
          return null;
        }
      }
    })

    gantt.templates.task_class = function(start: any, end: any, task: any) {
      if (task.planned_end) {
        console.log("PLANNED")
        var classes = ['has-baseline'];
        if (end.getTime() > task.planned_end.getTime()) {
          classes.push('overdue');
        }
        return classes.join(' ');
      }
      console.log("NPL");
      
      return ' '
    }
  
    gantt.templates.rightside_text = function (start: any, end: any, task: any) {
      if (task.planned_end) {
        if (end.getTime() > task.planned_end.getTime()) {
          var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
          var text = "<b>Overdue: " + overdue + " days</b>";
          return text;
        }
      }
      return ' '
    };



    gantt.attachEvent("onGanttReady", () => {
      var tooltips  = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })

    gantt.attachEvent("onTaskLoading", function (task: any) {
      console.log("LOADING")
      task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
      task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
      console.log( task.planned_start );
      console.log( task.planned_end );
      
      
      return true;
    });

    gantt.init(this.ganttContainer.nativeElement);
    gantt.parse(task)
}
}
