import { DateTime } from "luxon";

export function toReadableDate(dateStr: string): string {
    const luxonDate = DateTime.fromISO(dateStr, {
        zone: 'Europe/Helsinki',
      });     
    const format = "'Time: 'HH:mm 'Day: 'dd/MM/yyyy";
    return luxonDate.toFormat(format);
}