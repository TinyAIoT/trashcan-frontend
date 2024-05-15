"use client";

import React from 'react';
import PageTitle from "@/components/PageTitle";
import FillLevelChart from '@/components/FillLevelChart';
import { CardContent } from '@/components/Card';

const Home = () => {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Trashbins Detail" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Fill Level</p>
          <FillLevelChart />
        </CardContent>
        <CardContent>
          <p className="p-4 font-semibold">Battery Level (TODO!)</p>
          <FillLevelChart />
        </CardContent>
      </section>
    </div>
    );
};

export default Home;
