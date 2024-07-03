type Trashbin = {
  id: string;
  identifier: string;
  name: string;
  coordinates: [number | null, number | null];
  location: string;
  project: string;
  fillLevel: number;
  fillLevelChange: number;
  batteryLevel: number;
  signalStrength: number;
  lastEmptied: Date;
  assigned: boolean;
  imageUrl: string;
  // sensors: any[];
  // createdAt: Date;
  // updatedAt: Date;
};

export type { Trashbin };
