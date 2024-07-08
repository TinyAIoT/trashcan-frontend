type Trashbin = {
  _id: string;
  identifier: string;
  coordinates: [number, number];
  location: string;
  name: string;
  fillLevel: number;
  fillLevelChange: number;
  batteryLevel: number;
  signalStrength: number;
  image: string;
  lastEmptied: Date;
  assignee: {
    _id: string
  }
};

export type { Trashbin };
