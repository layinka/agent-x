import { Pipe, PipeTransform } from '@angular/core';

function toUTCDate(dt: Date){

  const utcDateF = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(),  dt.getDate(), dt.getHours(),dt.getMinutes(),dt.getSeconds()));
  // console.log(utcDateF.toUTCString());
  return utcDateF;
}

/**
 * Converts UTC date to Time ago or time left
 */
@Pipe({
  name: 'timeDiff',
  standalone: true
})
export class TimeDiffPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    if (value) {
      let targetDate = new Date(`${value}Z`)  // Date.UTC(
      // console.log('UTC Expiry: ', value, targetDate.toUTCString())
      // console.log('UTC Expiry After: ', value, toUTCDate(targetDate).toUTCString())
      let expiryDate=+toUTCDate(targetDate)
      let nowDate = new Date()
      
      // console.log('Now Expiry: ', nowDate, nowDate.toUTCString())
      // console.log('Now Expiry After: ',  toUTCDate(nowDate).toUTCString())
      let now = +toUTCDate(nowDate)
      let seconds = (expiryDate - now) / 1000; // expiry Date - current time
      let sign = Math.sign(seconds)
      let suffix = "left" // if the time is yet to come.
      if(sign === -1 ){
        seconds = Math.floor(seconds*sign) // removign the sign and the float part -25.5  = 25 seconds 
        suffix = "ago" // if time is already expired.
      }
      const intervals: {[ix:string]:number} = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      const allInterval = ['year', 'month','week','day', 'hour', 'minute', 'second'];
      let counter;
      for (let i of allInterval) {
        counter = Math.floor(seconds / intervals[i]);
        let toReturn: string = ""
        // calculateion shown for for 2hour:51 minute = 171 minute = 10260 second
        if (counter > 0) {
            toReturn += this.calculateTime(counter, i);  // this will give 2 hours
            let timeLeft = seconds - counter * intervals[i] // 3060 second  
            let index = allInterval.indexOf(i)+1 // get the index of next unit 
            i = allInterval[index]; // value of next unit = minute
            if(index > 6 ){
              return toReturn+ suffix // second ago for boundary case
            }
            counter = Math.floor(timeLeft / intervals[i]);  // 3060 second = 51
            toReturn= toReturn + " "+this.calculateTime(counter, i) + " " + suffix; // will calculate "2 hours 51 Minutes" from current time
            return toReturn; 
        }

      }
    }
    return value;
  }

  calculateTime(counter : number, timeUnit : string ){
    if (counter === 1) {
      return counter + ' ' +timeUnit; // singular (1 hours ago)
    } else {

      let toReturn = counter + ' ' + timeUnit + 's ';
      return toReturn; // plural (2 hours ago)
    }
  
  }
}
