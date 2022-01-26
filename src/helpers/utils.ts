import { DateTime } from "luxon";

export function toReadableDate(dateStr: string) {
    const luxonDate = DateTime.fromISO(dateStr, {
        zone: 'Europe/Helsinki',
      });     
    const dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
    const format = "'Time: 'HH:mm 'Day: 'dd/MM/yyyy";
    return luxonDate.toFormat(format);
}