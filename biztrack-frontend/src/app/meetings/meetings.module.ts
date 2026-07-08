import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MeetingsComponent } from './meetings.component';
import { FullCalendarModule } from '@fullcalendar/angular';

const routes: Routes = [
  { path: '', component: MeetingsComponent }
];

@NgModule({
  declarations: [
    MeetingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FullCalendarModule
  ]
})
export class MeetingsModule { }
