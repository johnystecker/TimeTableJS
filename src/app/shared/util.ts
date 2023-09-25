export interface LessonTime{
  id:number;
  start:string;
  end:string;
}

export interface Lesson{
  id:number;
  name:string;
  cv:boolean;
  code:string;
}

export interface LessonVariable extends Lesson{
  date:string[];
}

export interface Day{
  day:string;
  lessons:number[];
}
