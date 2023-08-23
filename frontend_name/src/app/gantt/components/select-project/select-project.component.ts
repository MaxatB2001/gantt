import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../models/Task';

@Component({
  selector: 'app-select-project',
  templateUrl: './select-project.component.html',
  styleUrls: ['./select-project.component.css']
})
export class SelectProjectComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {projects: Task[], filterFc: (ids: any[]) => void}) {}

  selectedProjectIds: any[] = []

  onCheck(project: Task) {
    if (!this.selectedProjectIds.includes(project.id)) {
      this.selectedProjectIds.push(project.id)
    } else {
      this.selectedProjectIds = this.selectedProjectIds.filter(id => id !== project.id)
    }
  }
}
