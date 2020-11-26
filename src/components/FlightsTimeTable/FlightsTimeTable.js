import React from 'react';
import FlightInfo from './components/FlightInfo';

export default function FlightsTimeTable({ flightsData }) {
  return (
    <ol className="list-of-flights">
      { 
        flightsData.map((flight, index) => {
          return <FlightInfo key={index} flight={flight} />
        })
      }
    </ol>
  );
}
