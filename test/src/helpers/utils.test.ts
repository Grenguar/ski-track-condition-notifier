import { toReadableDate } from "../../../src/helpers/utils";
import { skiData } from "../fixtures/ski-data";

it('some test', () => {
    const d = skiData.results[0].observations[0].time;

    const changedDate = toReadableDate(d);

    expect(changedDate).toBe('Time: 07:36 Day: 08/01/2022');
});