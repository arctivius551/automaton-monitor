"use client";
import Image from "next/image";
import { ResponsiveBump } from '@nivo/bump';
//import data from './data.json';
//<script src="https://code.highcharts.com/highcharts.js"></script>
//<script src="https://cdn.zingchart.com/zingchart.min.js"></script>

let data: any[] = [];
for( let i = 1; i <= 50; i++){

  let seriesData = [];
  for( let x = 1; x < 20; x++ ){
    seriesData.push( {"x": x,"y": i})
  }

  data.push({"id": `Series ${i}`, "data": seriesData})
}



export default function Home() {
  return (
    <main className="flex w-full h-lvh border border-red-500">
      <ResponsiveBump
          data={data}
          colors={{ scheme: 'spectral' }}
          lineWidth={3}
          activeLineWidth={6}
          inactiveLineWidth={3}
          inactiveOpacity={0.15}
          pointSize={10}
          activePointSize={16}
          inactivePointSize={0}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={3}
          activePointBorderWidth={3}
          pointBorderColor={{ from: 'serie.color' }}
          axisTop={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: -36,
              truncateTickAt: 0
          }}
          axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '',
              legendPosition: 'middle',
              legendOffset: 32,
              truncateTickAt: 0
          }}
          axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'ranking',
              legendPosition: 'middle',
              legendOffset: -40,
              truncateTickAt: 0
          }}
          margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
          axisRight={null}
        />
    </main>
  );
}
