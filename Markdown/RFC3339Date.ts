import { NUM_TO_LongDay, NUM_TO_ShortDay, NUM_TO_ShortMonth, NUM_TO_LongMonth} from './Mddata';

export enum DateType {
  COMPACT,
  SHORT,
  LONG,
  TIME,
}

const DATE = '(\\d{4})-(\\d{2})-(\\d{2})';
const TIME = '(\\d{2}):(\\d{2})?:(\\d{2})(\\.\\d+)?($|Z|([+-])(\\d{2}):(\\d{2})?)';

const DATE_TIME = DATE + 'T' + TIME;

const DATE_PREFIX = '\\{\\{DATE\\(';
const TIME_PREFIX = '\\{\\{TIME\\(';
const LONG = '(,(|\\s)LONG)';
const SHORT = '(,(|\\s)SHORT)';
const COMPACT = '(|(,(|\\s)COMPACT))';
const TAIL = '\\)\\}\\}';

const COMPACT_DATE = new RegExp(
  DATE_PREFIX
  + DATE_TIME
  + COMPACT
  + TAIL
);

const SHORT_DATE = new RegExp(
  DATE_PREFIX
  + DATE_TIME
  + SHORT
  + TAIL
);

const LONG_DATE = new RegExp(
  DATE_PREFIX
  + DATE_TIME
  + LONG
  + TAIL
);

const TIME_WITH_ZONE = new RegExp(
  TIME_PREFIX
  + DATE_TIME
  + TAIL
);


export class RFC3339Date {
  private static getMonthWithType(date: Date, dateType: DateType): string {
    switch(dateType) {
      case DateType.SHORT:
        return NUM_TO_ShortMonth[date.getMonth()];
      case DateType.LONG:
        return NUM_TO_LongMonth[date.getMonth()];
      case DateType.COMPACT:
        return (date.getMonth() + 1).toString();
      default:
        return '';
    }
  }

  private static getDayWithType(date: Date, dateType: DateType): string {
    switch(dateType) {
      case DateType.SHORT:
        return NUM_TO_ShortDay[date.getDay()];
      case DateType.LONG:
        return NUM_TO_LongDay[date.getDay()];
      case DateType.COMPACT:
        return date.getDate().toString();
      default:
        return '';
    }
  }

  // use TimeUtils.convertTime instead
  public static convertTime(value: string): string {
        let parts: string[] = value.split(':');
        let nHour: number = Number(parts[0]);
        let nMinute: number = Number(parts[1]);
        let part: string = nHour < 12 ? 'AM' : 'PM';
        nHour = nHour % 12 || 12;
        let hour: string = (nHour + '').length === 1 ? `0${nHour}` : nHour + '';
        let minute: string = (nMinute + '').length === 1 ? `0${nMinute}` : nMinute + '';
        return (
            `${hour}:` +
            `${minute} ` +
            `${part}`
        );
  }

  private static isValidDate(year: number, month: number, day: number){ 
    return (
      month > 0 && month < 13 &&
      year && year.toString().length === 4 &&
      day > 0 &&
      // Is it a valid day of the month?
      day <= (new Date(year, month, 0)).getDate()
    );
   }

   private static isValidTime(hour: number, minute: number, second: number){
     return hour >= 0 && hour < 24 
        && minute >= 0 && minute < 60 
        && second >= 0 && second <= 60; 
   }

  private static convertDateToString(date: Date, dateType: DateType): string {
    let year = date.getFullYear().toString();
    let month = this.getMonthWithType(date, dateType);
    let day = this.getDayWithType(date, dateType);

    switch(dateType) {
      case DateType.SHORT:
      case DateType.LONG:
        return (
          `${day}, ` +
          `${month} ${date.getDate()}, ` +
          `${year}`
        );
      case DateType.COMPACT:
        return (
          `${month}/` +
          `${day}/` +
          `${year}`
        );
      default:
        return '';
    }
  }

  private static convertTimeToString(date: Date, dateType: DateType): string {
    if (dateType !== DateType.TIME) {
      return '';
    }
    let hour = date.getHours();
    let minute = date.getMinutes();

    return this.convertTime(hour + ':' + minute);
  }

  private static parseDateAndTime(text: string, reg: RegExp, func: Function, dateType?: DateType): string {
    let regData: RegExpExecArray | null;
    while ((regData = reg.exec(text)) !== null) {
      let pre: string = text.slice(0, regData.index);

      var year   = +regData[1];
      var month  = +regData[2];
      var day    = +regData[3];
      var hour   = +regData[4];
      var minute = +regData[5];
      var second = +regData[6];
      // var msec = +regData[7];
      var tz     = regData[8];
      var flag   = regData[9] === '-' ? -1 : 1;
      var tzHour = +regData[10];
      var tzMin  = +regData[11];

      let dateTime: string;
      if (!this.isValidDate(year, month, day) || !this.isValidTime(hour, minute, second)) {
        dateTime = 'Invalid Date';
      } else {
        var tzOffset = new Date().getTimezoneOffset() + (tz === 'Z' ? 0 : (tzHour * 60 + tzMin) * flag);
        let date: Date = new Date(year, month - 1, day,  hour, minute - tzOffset, second);
        dateTime = func(date, dateType);
      }
      
      let tail: string = text.slice(regData.index + regData[0].length, text.length);

      text = pre + dateTime + tail;
    }
    
    return text;
  }

  public static parseCompactDate(text: string): string {
    return this.parseDateAndTime(text, COMPACT_DATE, this.convertDateToString.bind(this), DateType.COMPACT);
  }

  public static parseShortDate(text: string): string {
    return this.parseDateAndTime(text, SHORT_DATE, this.convertDateToString.bind(this), DateType.SHORT);
  }

  public static parseLongDate(text: string): string {
    return this.parseDateAndTime(text, LONG_DATE, this.convertDateToString.bind(this), DateType.LONG);
  }
  
  public static parseDate(text: string): string {
    return this.parseCompactDate(this.parseLongDate(this.parseShortDate(text)));
  }

  public static parseTime(text: string): string {
    return this.parseDateAndTime (text, TIME_WITH_ZONE, this.convertTimeToString.bind(this),DateType.TIME)
  }

  public static parseRFC3339(text: string): string { 
    return this.parseDate(this.parseTime(text));
  }
};
