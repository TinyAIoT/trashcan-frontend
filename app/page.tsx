/** @format */

import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import {
  DollarSign,
  Users,
  CreditCard,
  Activity,
  ShoppingCart,
} from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import SalesCard, { SalesProps } from "@/components/SalesCard";

const cardData: CardProps[] = [
  {
    label: "Total Trash Cans",
    amount: "2950",
    discription: "+20.1% from last year",
  },
  {
    label: "Full",
    amount: "800",
    discription: "+201 since last hour",
  },
  {
    label: "Over Half Way",
    amount: "1290",
    discription: "+350 since last hour",
  },
  {
    label: "Almost Empty",
    amount: "860",
    discription: "+430 since last hour",
  },
];

const uesrSalesData: SalesProps[] = [
  {
    name: "Olivia Martin",
    TrashcanID: "8",
  },
  {
    name: "Jackson Lee",
    TrashcanID: "5",
  },
  {
    name: "Isabella Nguyen",
    TrashcanID: "4",
  },
  {
    name: "William Kim",
    TrashcanID: "4",
  },
  {
    name: "Sofia Davis",
    TrashcanID: "4",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Dashboard" />
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
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Trash Can Emptied</p>

          <BarChart />
        </CardContent>
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Trash Empty</p>
            <p className="text-sm text-gray-400">
              265 Trash can were emptied in last hour
            </p>
          </section>
          {uesrSalesData.map((d, i) => (
            <SalesCard key={i} name={d.name} TrashcanID={d.TrashcanID} />
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
  );
}
