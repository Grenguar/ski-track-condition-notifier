import { skiData } from '../fixtures/ski-data';
import { getFinishedTracks, isFinished, isRecentObservation } from '../../../src/parser/ski';
import { DateTime, Settings } from 'luxon';

jest.mock('axios', () => jest.fn(() => Promise.resolve(skiData)));

describe('Test ski parser', () => {
  it('Track is good', () => {
    const finished = isFinished(skiData.results[0] as any);

    expect(finished).toBeTruthy();
  });

  it('Track is not good', () => {
    const finished = isFinished(skiData.results[1] as any);

    expect(finished).toBeFalsy();
  });

  it('should return 2 tracks in GOOD state', () => {
    const allFinishedTracks = getFinishedTracks(skiData as any);

    expect(allFinishedTracks.tracks).toHaveLength(2);
  });

  it('isRecent: should be false', () => {
    const isRecent = isRecentObservation(skiData.results[0].observations[0].time, 30);
    expect(isRecent).toBeFalsy();
  });

  it('isRecent: should return true', () => {
    const expectedNow = DateTime.local(2022, 1, 1, 1, 30, 0);
    Settings.now = () => expectedNow.toMillis();

    const testDate = '2022-01-01T01:25:00.000000+0200';
    const isRecent = isRecentObservation(testDate, 30);
    expect(isRecent).toBeTruthy();
  });
});
