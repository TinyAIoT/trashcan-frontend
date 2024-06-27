/** @format */

import PageTitle from "@/components/PageTitle";
import Card, { CardContent, CardProps } from "@/components/Card";
import { HeatmapFillLevel } from "@/components/Heatmap/HeatmapFillLevel";
import { HeatmapBatteryLevel } from "@/components/Heatmap/HeatmapBatteryLevel";

const cardData: CardProps[] = [
  {
    label: "Total number",
    amount: "42",
    discription: "+1 since last day",
  },
  {
    label: "Nearly full",
    amount: "18",
    discription: "+2 since last hour",
  },
  {
    label: "Low battery",
    amount: "5",
    discription: "Same as last week",
  },
  {
    label: "Broken sensors",
    amount: "2",
    discription: "-1 since last week",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Dashboard" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Distribution of fill level of all bins</p>
          {/* https://www.react-graph-gallery.com/heatmap */}
          <HeatmapFillLevel />
        </CardContent>
        <CardContent>
          <p className="p-4 font-semibold">Distribution of battery level of all bins</p>
          {/* https://www.react-graph-gallery.com/heatmap */}
          <HeatmapBatteryLevel />
        </CardContent>
      </section>
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            discription={d.discription}
            label={d.label}
          />
        ))}
      </section>
    </div>
  );
}
