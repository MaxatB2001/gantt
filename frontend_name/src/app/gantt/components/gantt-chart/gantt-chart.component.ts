import { Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Task } from "dhtmlx-gantt"
import "dhtmlx-gantt";
import * as moment from 'moment';
moment.locale('ru')
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectProjectComponent } from '../select-project/select-project.component';
// import "dhtmlx-gantt/codebas"
declare let gantt: any;

var task = {
  data:[
  {id:1, text:"Project #1",start_date:"4-7-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.6, open: true},
  {id:2, text:"Task #1",   start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 1, parent:1},
  {id:3, text:"Task #2",   start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.5, open: true, parent:1},
  {id:4, text:"Task #2.1", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 1,   open: true, parent:3},
  {id:5, text:"Task #2.2", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.8, open: true, parent:3},
  {id:6, text:"Task #2.3", start_date:"01-04-2023", duration:11, planned_start:"01-04-2023", planned_end:"06-04-2023",
  progress: 0.2, open: true, parent:3, test: 2},
   
{id: 586, start_date: '4-7-2023', text: 'wffw', progress: 0, duration: 2},
{id: 628, start_date: '2-7-2023', text: 'task', progress: 0, duration: 2},
{id: 629, start_date: '2-7-2023', text: 'ganttt', progress: 0, duration: 11}
  ],
  links:[
  {id:1, source:1, target:2, type:"1"},
  {id:2, source:1, target:3, type:"1"},
  {id:3, source:3, target:4, type:"1"},
  {id:4, source:4, target:5, type:"0"},
  {id:5, source:5, target:6, type:"0"}
  ]
};

function byId(list:any, id:any) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].key == id)
      return list[i].label || "";
  }
  return "";
}

@Component({
  selector: 'gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GanttChartComponent {

  constructor(private taskService: TaskService, private userService: UserService, public dialog: MatDialog) {}

  @ViewChild('gantt_here', { static: true }) ganttContainer!: ElementRef;

  startDate: moment.Moment = moment()
  endDate: moment.Moment = moment()

  ngOnInit(){

    gantt.i18n.setLocale("ru");
    gantt.plugins({
      tooltip: true,
      grouping: true,
      auto_scheduling: true,
      drag_timeline: true
    })

    gantt.config.auto_scheduling = true;
	gantt.config.auto_scheduling_strict = true;
	gantt.config.auto_scheduling_compatibility = true;

  gantt.config.min_column_width = 50;
	gantt.config.scale_height = 90;

  var weekScaleTemplate = function (date: any) {
		var dateToStr = gantt.date.date_to_str("%d %M");
		var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
		return dateToStr(date) + " - " + dateToStr(endDate);
	};

  var daysStyle = function(date: any){
		// you can use gantt.isWorkTime(date)
		// when gantt.config.work_time config is enabled
		// In this sample it's not so we just check week days

		if(date.getDay() === 0 || date.getDay() === 6){
			return "weekend";
		}
		return "";
	};
  gantt.config.scales = [
		{unit: "month", step: 1, format: "%F, %Y"},
		{unit: "week", step: 1, format: weekScaleTemplate},
		{unit: "day", step:1, format: "%D", css:daysStyle }
	];
    // gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
	gantt.config.bar_height = 16;
	gantt.config.row_height = 40;
  gantt.locale.labels.section_baseline = "Planned";
  gantt.locale.labels.baseline_enable_button = 'Set';
  gantt.locale.labels.baseline_disable_button = 'Remove';
  gantt.config.auto_scheduling = true;
  var labels = gantt.locale.labels;
	labels.column_owner = labels.section_owner = "Owner";

  gantt.config.columns.push({name: "owner", label: "Исполнитель", width: 80, align: "center", template: function (item: any) {
    return byId(gantt.serverList('owner'), item.owner)}})
  
    gantt.addTaskLayer({
      renderer: {
        render: function draw_planned(task: any) {
        
          
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
      
        var classes = ['has-baseline'];
        if (end.getTime() > task.planned_end.getTime()) {
          classes.push('overdue');
        }
        return classes.join(' ');
      }

      
      return ' '
    }
  
    gantt.templates.rightside_text = function (start: any, end: any, task: any) {
      if (task.planned_end) {
        if (end.getTime() > task.planned_end.getTime()) {
          var overdue = Math.ceil(Math.abs((end.getTime() - task.planned_end.getTime()) / (24 * 60 * 60 * 1000)));
          var text = "<b>Просрочено на: " + overdue + " дней</b>";
          return text;
        }
      }
      return ' '
    };

    gantt.attachEvent("onAfterTaskAutoSchedule", function (task: any, new_date: any, constraint: any, predecessor: any) {
      if(task && predecessor){
        gantt.message({
          text: "<b>" + task.text + "</b> has been rescheduled to " + gantt.templates.task_date(new_date) + " due to <b>" + predecessor.text + "</b> constraint",
          expire: 4000
        });
      }
    });

    gantt.attachEvent("onGanttReady", () => {
      var tooltips  = gantt.ext.tooltips
      tooltips.tooltip.setViewport(gantt.$task_data)
    })

    gantt.attachEvent("onTaskLoading", function (task: any) {
      console.log("LOADING")
      console.log(task.start_date);
      task.text = task.text
      // task.start_date =gantt.date.parseDate(task.start_date, "xml_date");
      task.planned_start = gantt.date.parseDate(task.planned_start, "xml_date");
      task.planned_end = gantt.date.parseDate(task.planned_end, "xml_date");
      
      return true;
    });

    gantt.attachEvent("onTaskClick", (id: number, e: any) => {
      let task = gantt.getTask(id)
      console.log(task)
      return true
    })

    gantt.attachEvent("onAfterTaskDrag", (id: number, mode: any) => {
      const task = gantt.getTask(id)
      if (mode == gantt.config.drag_mode.progress) {
        var pr = Math.floor(task.progress * 100 * 10) / 10;
        console.log(pr);
      } else {
			console.log(task);
      this.taskService.updateTask(task).subscribe(data => {
        console.log(data)
      })
      
      }
    })

    gantt.attachEvent("onAfterLinkAdd", (linkId: number, link: any) => {
      console.log(link)
      console.log(linkId);
      this.taskService.createLink(link).subscribe(data => {
        console.log(data)
      })
    })


    this.userService.getUsers().subscribe(data => {
      console.log(data)
      const users = data.map(user => {
        return {key: user.id, label: user.lastName + " " + user.firstName}
      })
      console.log(users)
      gantt.serverList("owner", users)
      gantt.config.lightbox.sections = [
        {name: "description", height: 70, map_to: "text", type: "textarea", focus: true},
        {name: "time", map_to: "auto", type: "duration"},
        {
          name: "baseline",
          map_to: {start_date: "planned_start", end_date: "planned_end"},
          button: true,
          type: "duration_optional"
        },
        {name: "Исполнитель", height: 22, map_to: "owner", type: "select", options: gantt.serverList("owner")},
      ];
      gantt.init(this.ganttContainer.nativeElement);
      this.taskService.getTasks().subscribe(data =>{
        console.log(data)
        gantt.parse({
          data: data.ganttTasks,
          links: data.links
        })
      })
    })
    // gantt.parse(task)
}

test = () => {
  // gantt.getTask(665).owner = "2f118e26-475c-4e20-8bc1-8d5dbf6dd782";
  // gantt.updateTask(665)
  // gantt.config.start_date = new Date()
  // gantt.config.end_date = new Date(2023, 10, 10)
  // gantt.render()
  // console.log(gantt.config.start_date)
}

 showGroups(listname: string) {
  if (listname) {
    gantt.groupBy({
      groups: gantt.serverList(listname),
      relation_property: listname,
      group_id: "key",
      group_text: "label"
    });
    gantt.sort("start_date");
  } else {
    gantt.groupBy(false);

  }
}

openSelectProjectDialog(e: any) {
  const rect = e.currentTarget.getBoundingClientRect()
  var projects = gantt.getTaskByTime().filter((task: Task) => task.type == "project");
  
  this.dialog.open(SelectProjectComponent, {
    backdropClass: 'cdk-overlay-transparent-backdrop',
    position: {left: `${rect.left}px`, top: `${rect.bottom + 10}px`},
    data: {projects}
  })
}
}
