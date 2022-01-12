import { DataResult, SkiTracksData } from '../models/ski-track-data';
import { DateTime } from 'luxon';
import { FinishedTracks, TrackMaintenance } from '../models/finished-tracks';

export function getFinishedTracks(data: SkiTracksData): FinishedTracks {
  return {
    tracks:
      data.results.filter(isFinished).map((result: DataResult) => {
        const name = result.name.fi;
        const address = result.street_address.fi;
        const date = result.observations[0].time.toString();
        return {
          finished: true,
          date,
          name,
          address,
          state: 'good',
        };
      }) || [],
  };
}

export function isFinished(result: DataResult): boolean {
  const skiTrailCondition = result.observations.find((obs) => obs.property === 'ski_trail_condition');
  if (skiTrailCondition) {
    return skiTrailCondition.quality === 'good' && skiTrailCondition.value === 'good';
  }
  return false;
}

/**
 * Get the
 * @param dateStr coming from the ski data (example: 2022-01-08T07:36:29.876845+0200)
 * @param timeInterval in minutes
 */
export function isRecentObservation(dateStr: string, timeInterval: number) {
  const parsedDate = DateTime.fromISO(dateStr, {
    zone: 'utc+2',
  });              
  const currentDate = DateTime.now().toUTC(120);
  const timeDifference = currentDate.diff(parsedDate, 'minute').as('minutes');
  console.log('current date', currentDate.toString());
  console.log('parsed date', parsedDate.toString());
  console.log('Difference in minutes', timeDifference);
  return timeDifference <= timeInterval;
}
