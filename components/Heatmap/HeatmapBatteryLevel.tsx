import { Heatmap } from "./Heatmap";

type Entry = {
  time: number; // Unix timestamp
  percentage: number; // (10, 20, 30, ..., 90, 100)
  amount: number;
};

function generateMockData(startTimestamp: number, endTimestamp: number): Entry[] {
  const mockData: Entry[] = [];
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  
  function skewedRandom() {
    return Math.pow(Math.random(), 3); // Cubing a random number skews the distribution towards higher values
  }

  for (let time = startTimestamp; time <= endTimestamp; time += millisecondsPerDay) {
    const percentages = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    let remainingAmount = 20;

    for (let i = 0; i < percentages.length; i++) {
      const percentage = percentages[i];
      let amount = 0;

      // Distribute the remaining amount over the fill levels with a skewed random value
      if (i === percentages.length - 1) {
        amount = remainingAmount;
      } else {
        amount = Math.min(Math.floor(skewedRandom() * remainingAmount), remainingAmount);
        remainingAmount -= amount;
      }

      mockData.push({ time, percentage, amount });
    }
  }

  return mockData;
}

const startTimestamp = new Date('2023-01-01').getTime();
const endTimestamp = new Date('2024-07-01').getTime();
const data = generateMockData(startTimestamp, endTimestamp);

export const HeatmapBatteryLevel = () => (
  <Heatmap data={data} />
);
