import { Module } from '@nestjs/common';
import { GanttController } from './gantt.controller';
import { GanttService } from './gantt.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedView } from 'src/schemas/savedView.schema';

@Module({
  controllers: [GanttController],
  providers: [GanttService],
  imports: [
    TypeOrmModule.forFeature([
      SavedView
    ])
  ]
})
export class GanttModule {}
