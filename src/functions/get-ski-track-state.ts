import axios from 'axios';
import * as AWS from '@aws-sdk/client-sns';
import { SkiTracksData } from '../models/ski-track-data';
import { PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { getFinishedTracks, isRecentObservation } from '../parser/ski';

export async function handler() {
  const timeInterval = parseInt(process.env.timeInterval as string, 10);
  const region = (process.env.region as string) || 'eu-west-1';
  const topicArn = process.env.topicArn as string;
  const client = new AWS.SNS({ region });
  const skiData = await getSkiTrackData();
  const finishedTracks = getFinishedTracks(skiData);

  if (finishedTracks.tracks.length > 0) {
    const promises: any[] = [];
    finishedTracks.tracks
      .filter((track) => isRecentObservation(track.date, timeInterval))
      .forEach((track) => {
        console.log('Maintained track: ', JSON.stringify(track))
        const params: PublishCommandInput = {
          TopicArn: topicArn,
          Message: `Track "${track.name}" was completed on ${track.date}. Address: ${track.address}`,
          Subject: `Ski Track "${track.name}" completed!`,
        };
        const publishCommand = new PublishCommand(params);
        promises.push(client.send(publishCommand));
      });
    await Promise.all(promises);
    console.log(`Notifications sent ${promises.length} time(s)`);
    if (promises.length === 0) {
      console.log('There are no recent maintained tracks');
    }
  }
}

async function getSkiTrackData() {
  const url =
    'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo';
  const resp = await axios.get(url);
  return resp.data as SkiTracksData;
}
