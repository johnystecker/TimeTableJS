import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {DateRangeJS} from "./shared/util";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private subject : Subject<DateRangeJS> = new Subject<DateRangeJS>();
  constructor() { }

  setDateRange(range: DateRangeJS){
    this.subject.next(range);
  }

  getDateRange(){
    return this.subject;
  }
}
