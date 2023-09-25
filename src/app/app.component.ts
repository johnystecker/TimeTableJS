import {Component, OnInit} from '@angular/core';
import lessonsJson from '../assets/lessons.json';
import lessonTimesJson from '../assets/lessonsTimes.json';
import daysJson from "../assets/days.json";
import {Lesson, LessonTime, LessonVariable, Day} from "./shared/util";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'TimeTableJS';

  lessonsDefault: Lesson[];
  lessonTimes: LessonTime[];
  days:Day[];

  ngOnInit() {
    this.lessonTimes = lessonTimesJson.map(e => e as LessonTime);
    this.lessonsDefault = lessonsJson.itemsDefault.map(e => e as Lesson);
    this.days = daysJson.map(e => e as Day);
    console.log(this.lessonTimes);
    console.log(this.lessonsDefault);
    console.log(this.days);
  }

  constructor() {}


  getLesson(lesson:number){
    if(lesson === 0) return "&nbsp;<br>&nbsp<br>&nbsp;";
    const les:Lesson = this.lessonsDefault.find(obj => obj.id === lesson);
    return `${les.name}<br>${les.cv ? "CV" : ""}<br>${les.code}`;
  }


}
