import axios from "axios";
import * as AWS from "@aws-sdk/client-sns";
import { SkiTracksData } from "../models/ski-track-data";
import { PublishCommand, PublishInput } from "@aws-sdk/client-sns";

const client = new AWS.SNS({ region: 'eu-west-1' });

export async function handler () {
    const url = 'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo'
    const resp = await axios.get(url);
    const data = resp.data as SkiTracksData;
    const tracksCount = `There are ${data.count} in Espoo`;
    const params: PublishInput = {
        TopicArn: process.env.topicArn,
        Message: tracksCount,
    };
    const snsData = await client.send(new PublishCommand(params));
    return {
        statusCode: 200,
        body: JSON.stringify(snsData)
    };
}

