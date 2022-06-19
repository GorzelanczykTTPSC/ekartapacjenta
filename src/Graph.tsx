import React, { useState, useEffect } from 'react';
import { Observation, ObservationParams } from './Observation';
import dateFormat from 'dateformat'
import { Card, Form, Button, Stack } from 'react-bootstrap';
import Chart from 'react-apexcharts';


interface DataPiece {
  x: string,
  y: number,
  unit: string
}


function Graph({observations, observationType}: {observations: Observation[][]; observationType: string}) {
  const [data, setData] = useState<Array<DataPiece>>([]);

  const prepareData = (
    previousValue: DataPiece[],
    currentValue: Observation[],
    currentIndex: number,
    array: Observation[][]
  ): DataPiece[] => {
    const observation = currentValue.find((observation: Observation) => {
      return observation.data.code.text === observationType;
    });
    if (!observation) return previousValue;
    const date = observation!.date.split('T')[0];
    const value = observation!.data?.valueQuantity?.value as number;
    const unit = observation!.data?.valueQuantity?.unit as string

    return [{x: date, y: value, unit: unit}, ...previousValue];
  }

  useEffect(() => {
    const newdata = observationType ? observations.reduce(prepareData, []) : [];
    setData(newdata);
  }, [observations, observationType]);

  return (
    data.length ?
      <Chart
        options={{
          chart: {type: "line"},
          markers: {size: 6},
          xaxis: {title: {text: "Date"}},
          yaxis: {title: {text: data?.at(0)?.unit}}
        }}
        series={[{data: data, name: observationType}]} /> :
      null
  )
}


export { Graph };
