import axios from 'axios';
import * as AWS from '@aws-sdk/client-sns';
import { SkiTracksData } from '../models/ski-track-data';
import { PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { getFinishedTracks } from '../parser/ski';

export async function handler() {
  const region = (process.env.region as string) || 'eu-west-1';
  const topicArn = process.env.topicArn as string;
  const client = new AWS.SNS({ region });
  const skiData = await getSkiTrackData();
  const tracksCount = `There are ${skiData.count} in Espoo`;
  console.log(JSON.stringify(skiData));
  const params: PublishCommandInput = {
    TopicArn: topicArn,
    Message: JSON.stringify(getFinishedTracks(skiData)),
    Subject: `Ski maintenance completed! Tracks count: ${tracksCount}`,
  };
  const publishCommand = new PublishCommand(params);
  const snsData = await client.send(publishCommand);
  return {
    statusCode: 200,
    body: JSON.stringify(snsData),
  };
}

async function getSkiTrackData() {
  const url =
    'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo';
  const resp = await axios.get(url);
  return resp.data as SkiTracksData;
}
