import * as AWS from '@aws-sdk/client-sns';
import { PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { getFinishedTracks, isRecentObservation } from '../parser/ski';
import { getSkiTrackData } from '../services/ski-service';

export async function handler() {
  const timeInterval = parseInt(process.env.timeInterval as string, 10);
  const region = (process.env.region as string) || 'eu-west-1';
  const topicArn = process.env.topicArn as string;
  const client = new AWS.SNS({ region });
  const municipality = 'espoo';
  const skiData = await getSkiTrackData(municipality);
  const finishedTracks = getFinishedTracks(skiData);

  if (finishedTracks.tracks.length > 0) {
    const promises: any[] = [];
    finishedTracks.tracks
      .filter((track) => isRecentObservation(track.date, timeInterval))
      .forEach((track) => {
        console.log('Maintained track: ', JSON.stringify(track))
        const params: PublishCommandInput = {
          TopicArn: topicArn,
          Message: `
Track: ${track.name} 
Date completed: ${track.date} 
Address: ${track.address}
          `,
          Subject: `Ski Track "${track.name}" completed!`,
        };
        const publishCommand = new PublishCommand(params);
        promises.push(client.send(publishCommand));
      });
    await Promise.all(promises);
    console.log(`Notifications sent ${promises.length} time(s)`);
  }
}


