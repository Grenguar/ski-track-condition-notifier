import { DataResult, SkiTracksData } from '../models/ski-track-data';
import { DateTime } from 'luxon';

export function getFinishedTracks(data: SkiTracksData) {
  return {
    tracks:
      data.results.filter(isFinished).map((result: DataResult) => {
        const name = result.name.fi;
        const address = result.street_address;
        const time = result.observations[0].time.toString();
        return {
          finished: true,
          time,
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

// export function isRecentObservation(dateStr: string, timeout: number) {
//   //2022-01-08T07:36:29.876845+0200
//   const parsedDate = DateTime.fromFormat(dateStr, 'yyyy-MM-ddTHH:mm:ss.SSSuuuZZZ');
//   console.log(parsedDate);
// }
