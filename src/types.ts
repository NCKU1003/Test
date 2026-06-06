/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SpotType = 'food' | 'activity' | 'shopping' | 'attraction' | 'stay' | 'transport';

export interface ParkingGasDetails {
  parking: string;
  gas: string;
}

export interface Spot {
  id: string;
  time: string;
  name: string;
  description: string;
  type: SpotType;
  highlights: string[];
  gmapUrl: string;
  parkingAndGasInfo: ParkingGasDetails;
  photoTip?: string;
  photoPlaceholder?: string; // high-quality visual placeholder
}

export interface ItineraryDay {
  dayNumber: number;
  dateStr: string;
  title: string;
  spots: Spot[];
  clothingSuggestion: string;
  seaCondition: {
    waveHeight: string;
    uvIndex: string;
    seaSuitability: string;
    warningNote: string;
  };
}

export interface WeatherDay {
  date: string;
  dayName: string;
  temp: string;
  windSpeed: string;
  tideTimeText: string;
  uvLevel: string;
  conditionText: string;
  emoji: string;
}

export interface GuideCategory {
  id: string;
  iconName: string;
  title: string;
  items: {
    id?: string;
    name: string;
    desc: string;
    checked?: boolean;
    tag?: string;
    link?: string;
  }[];
}
