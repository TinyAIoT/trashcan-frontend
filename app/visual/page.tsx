"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import PageTitle from "@/components/PageTitle";
import { CardContent } from "@/components/Card";

interface SensorData {
  name: string;
  value: string;
  time: string;
}

const App = () => {
  const [sensorDataPM10, setSensorDataPM10] = useState([]);
  const [sensorDataPM2, setSensorDataPM2] = useState([]);
  const [sensorDataBME280, setSensorDataBME280] = useState([]);

  useEffect(() => {
    const makeObject = (arr: any) => {
      return {
        name: arr[0].title,
        value: arr[0].lastMeasurement.value,
        time: new Date(arr[0].lastMeasurement.createdAt).toLocaleTimeString(),
      };
    };
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.opensensemap.org/boxes/5b3e7f6f5dc1ec001be11cf1"
        );
        const data = response.data;

        const newSensorDataPM10 = data.sensors.filter(
          (sensor: any) => sensor.title === "PM10"
        );
        const PM10Object = makeObject(newSensorDataPM10);

        setSensorDataPM10((prevState: any) => {
          return [...prevState, PM10Object];
        });

        const newSensorDataPM2 = data.sensors.filter(
          (sensor: any) => sensor.title === "PM2.5"
        );
        const PM2Object = makeObject(newSensorDataPM2);

        setSensorDataPM2((prevState: any) => {
          return [...prevState, PM2Object];
        });

        const newSensorDataTemp = data.sensors.filter(
          (sensor: any) => sensor.unit === "°C"
        );
        const tempObject = makeObject(newSensorDataTemp);

        setSensorDataBME280((prevState: any) => {
          return [...prevState, tempObject];
        });
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchData(); // Fetch initial data

    const interval = setInterval(fetchData, 60000); // Fetch data every 20 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array for initial fetch

  useEffect(() => {
    console.log("updated", sensorDataPM10);
  }, [sensorDataPM10]);

  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="Visual Representation U6B GTÜ SSH Bölling & Partner" />
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <LineChart width={800} height={400} data={sensorDataPM10}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" name="PM 10" stroke="#8884d8" />
        </LineChart>
      </section>

      <LineChart width={800} height={400} data={sensorDataPM2}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" name="PM 2.5" stroke="#7FFFD4" />
      </LineChart>

      <LineChart width={800} height={400} data={sensorDataBME280}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="value"
          name="Temp(°C)"
          stroke="#FF5733"
        />
      </LineChart>
    </div>
  );
};

export default App;
