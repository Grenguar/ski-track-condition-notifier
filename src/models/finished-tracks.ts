export interface FinishedTracks {
  tracks: TrackMaintenance;
}

export interface TrackMaintenance {
  finished: boolean;
  date: string;
  name: string;
  address: string;
  state: string;
}
