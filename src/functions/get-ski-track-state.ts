import axios from "axios";
import * as AWS from "@aws-sdk/client-sns";
import { DataResult, SkiTracksData } from "../models/ski-track-data";
import { PublishCommand, PublishCommandInput } from "@aws-sdk/client-sns";
import { FinishedTracks } from "../models/finished-tracks";

export async function handler () {
    const url = 'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo'
    const resp = await axios.get(url);
    const data = resp.data as SkiTracksData;
    const tracksCount = `There are ${data.count} in Espoo`;
    const params: PublishInput = {
        TopicArn: process.env.topicArn,
        Message: tracksCount,
    };
    const region = (process.env.region as string) || 'eu-west-1';
    const topicArn = process.env.topicArn as string
    const client = new AWS.SNS({ region });
    const skiData = await getSkiTrackData();
    const tracksCount = `There are ${skiData.count} in Espoo`;
    console.log(JSON.stringify(skiData));
    const params: PublishCommandInput = {
        TopicArn: topicArn,
        Message: JSON.stringify(tracksCount),

        Subject: 'Ski maintenance completed!'
    };
    const publishCommand = new PublishCommand(params);
    const snsData = await client.send(publishCommand);
    return {
        statusCode: 200,
        body: JSON.stringify(snsData)
    };
}

async function getSkiTrackData() {
    const url = 'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo'
    const resp = await axios.get(url);
    return resp.data as SkiTracksData;
}

function getLatestMaintenanceData(data: SkiTracksData) {
    return {
        tracks: data.results
            .map((result: DataResult) => {
                const name = result.name.fi;
                const address = result.street_address;
                const skiTrailCondition = result.observations.find(obs => obs.property === 'ski_trail_condition')
                if (skiTrailCondition) {
                    const time = skiTrailCondition.time.toString();
                    if (skiTrailCondition.quality === 'good' && skiTrailCondition.value === 'good') {
                        const state = 'good';
                        const finished = true;
                        return {
                            finished: finished,
                            time,
                            name,
                            address,
                            state
                        }
                    } else {
                        return {};
                    }
                } else {
                    return {};
                }
            })
    };  
}
