import {Component, Inject, Injectable, LOCALE_ID, OnInit} from '@angular/core';
import lessonsJson from '../assets/lessons.json';
import lessonTimesJson from '../assets/lessonsTimes.json';
import daysJson from "../assets/days.json";
import {DateRangeJS, Day, Lesson, LessonTime, LessonVariable} from "./shared/util";
import {DateRange, MatDateRangeSelectionStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY} from '@angular/material/datepicker';
import {DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter} from '@angular/material/core';
import { FormControl } from '@angular/forms';
import {AppService} from "./app.service";

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter{
  override getFirstDayOfWeek(): number {
    return 1;
  }
}
@Injectable()
export class WeekRangeSelectionStrategy implements MatDateRangeSelectionStrategy<Date> {
  constructor(private _dateAdapter: DateAdapter<Date>, private service:AppService) {
  }


  selectionFinished(date: Date | null): DateRange<Date> {
    let dr =  this._createFiveDayRange(date);
    if(date)
      this.service.setDateRange({start : dr.start, end: dr.end});
    return dr;
  }

  createPreview(activeDate: Date | null): DateRange<Date> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: Date | null): DateRange<Date> {
    if (date) {
      const day = date.getDay() - 1
      const start = this._dateAdapter.addCalendarDays(date, (day === -1 ? -6 : -day));
      const end = this._dateAdapter.addCalendarDays(date,   (day === -1 ? 0 : 6 - day));
      return new DateRange<Date>(start, end);
    }
  return new DateRange<Date>(null, null);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: WeekRangeSelectionStrategy,
    }
    ]
})
export class AppComponent implements OnInit {
  title = 'TimeTableJS';

  lessonsDefault: Lesson[];
  lessonsVariable: LessonVariable[];
  lessonTimes: LessonTime[];
  days: Day[];

  startDate: Date;
  endDate: Date;

  ngOnInit() {
    this.lessonTimes = lessonTimesJson.map(e => e as LessonTime);
    this.lessonsDefault = lessonsJson.itemsDefault.map(e => e as Lesson);
    this.lessonsVariable = lessonsJson.itemsVariable.map(e => e as LessonVariable);
    this.days = [...daysJson].map(e => e as Day);

    const date = new Date();
    const day = date.getDay() - 1;
    this.startDate = this.dateAdapter.addCalendarDays(date, (day === -1 ? -6 : -day));
    this.endDate = this.dateAdapter.addCalendarDays(date,   (day === -1 ? 0 : 6 - day));
    this.service.setDateRange({start: this.startDate, end: this.endDate});
  }

  constructor(private service: AppService, private dateAdapter: DateAdapter<Date>) {
    this.subscribeToDateRange();
  }


  getLesson(lesson:number){
    if(lesson === 0) return "&nbsp;<br>&nbsp<br>&nbsp;";
    const les:Lesson = [...this.lessonsVariable, ...this.lessonsDefault].find(obj => obj.id === lesson);
    return `${les.name}<br>${les.cv ? "CV" : ""}<br>${les.code}`;
  }

  subscribeToDateRange(){
    this.service.getDateRange().subscribe( value => {
      this.days = JSON.parse(JSON.stringify(daysJson)).map((e: Day) => e as Day);
      this.updateTable(value)
    });
  }


  updateTable(valueDateRange: DateRangeJS){
    this.lessonsVariable.forEach(valueLesson => {
      valueLesson.occurrence.forEach(valueOccurence => {
        valueOccurence.dates.forEach(valueOccurenceDate => {
          let valueDate = new Date(valueOccurenceDate);
          if(valueDate.getTime() >= valueDateRange.start.getTime() && valueDate.getTime() <= valueDateRange.end.getTime())
            this.replaceLessonsInDays(valueDate.getDay(), valueOccurenceDate, valueLesson)
        })
      })
    })
  }

  replaceLessonsInDays(dayOfWeek: number, valueDateString:string, valueLesson: LessonVariable){
    let occurrence:string;
    switch (dayOfWeek){
      case 1 : occurrence = 'PON'; break;
      case 2 : occurrence = 'UTO'; break;
      case 3 : occurrence = 'STR'; break;
      case 4 : occurrence = 'STV'; break;
      case 5 : occurrence = 'PIA'; break;
    }
    valueLesson.occurrence.find((value) => value.day === occurrence).lessons.forEach((value) => {
      this.days.find( (value) => value.day === occurrence).lessons[value-2] = valueLesson.id
    })

  }

  getCssForLesson(lesson: number) : string{
    if(lesson === 0) return 'removeBorder'
    if(lessonsJson.itemsVariable.map(item => item.id).indexOf(lesson) > -1) return 'lessonVariable';
    return 'lessonDefault';
  }
}



