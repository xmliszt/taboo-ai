import dateFormat from 'dateformat';

export function log(...parts: string[]) {
  console.log(
    `[${dateFormat(new Date(), 'dd-mm-yyyy H:MM:ss')}}] - ${parts.join(' ')}`
  );
}
