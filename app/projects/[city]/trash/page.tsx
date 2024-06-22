/** @format */

import PageTitle from "@/components/PageTitle";
import Card, { CardProps } from "@/components/Card";
import Heatmap from "@/components/HeatMap";

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
      <h2 className="text-2xl font-semibold">Distribution of fill level of all bins</h2>
      <div className="w-full h-300">
        <Heatmap />
      </div>
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
