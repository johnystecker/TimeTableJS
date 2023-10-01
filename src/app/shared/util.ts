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
  occurrence:Occurrence[]
}

export interface Occurrence{
  day: string;
  lessons: number[];
  dates: string[];
}

export interface Day{
  day:string;
  lessons:number[];
}

export interface DateRangeJS{
  start : Date;
  end : Date;
}
