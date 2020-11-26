import React from 'react';

export default function FlightInfo({ flight }) {
  return (
    <li>
      <p>
        Flight from {flight.departure.airport} to {flight.arrival.airport}, {flight.flight_status} for {flight.flight_date}
      </p>
    </li>
  );
}
