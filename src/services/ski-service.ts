import axios from "axios";
import { SkiTracksData } from "../models/ski-track-data";

export async function getSkiTrackData(municipality: string) {
    const url =
      `https://api.hel.fi/servicemap/v2/unit/?service=191&only=id,name,location,street_address,services,municipality&include=observations&geometry=false&page_size=1000&municipality=${municipality}`;
    const resp = await axios.get(url);
    return resp.data as SkiTracksData;
}