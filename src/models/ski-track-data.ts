export interface SkiTracksData {
<<<<<<< HEAD
    count: number;
    results: Result[];
}

export interface Result {
    id: number;
    name: Name;
    street_address: StreetAddress;
    municipality: string;
    services: number[];
    location: Location;
    observations: Observation[];
=======
  count: number;
  results: DataResult[];
}

export interface DataResult {
  id: number;
  name: Name;
  street_address: StreetAddress;
  municipality: string;
  services: number[];
  location: Location;
  observations: Observation[];
>>>>>>> 0fe58bc (adding tests)
}

export interface StreetAddress {
  fi: string;
  sv: string;
  en: string;
}

export interface Observation {
  unit: number;
  id: number;
  property: string;
  time: string;
  expiration_time?: any;
  name: Name;
  quality: string;
  value: string;
  primary: boolean;
}

// declare module namespace {

export interface Name {
  fi: string;
  sv: string;
  en?: string;
}

export interface Location {
  type: string;
  coordinates: number[];
}
