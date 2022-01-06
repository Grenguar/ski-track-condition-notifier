import axios from "axios";
import * as AWS from "@aws-sdk/client-sns";

const client = new AWS.SNS({ region: 'eu-west-1' });

export async function handler () {
    const url = 'https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=espoo'
    const resp = await axios.get(url);
    const data = resp.data as SkiTracksData
    return {
        statusCode: 200,
        body: JSON.stringify(`There are ${data.count} in Espoo`)
    };
}

export interface SkiTracksData {
    count: number;
}