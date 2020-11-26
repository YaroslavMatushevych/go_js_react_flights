import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CircularProgress,
} from '@material-ui/core';
// components
import FlightsTimeTable from './components/FlightsTimeTable';
import FlightsBoard from './components/FlightsBoard';
import FilterSlider from './components/FilterSlider';
// styles
import './App.css';

function App() {
  const [state, setState] = useState({
    flightsData: [],
    nodeDataArray: [],
    linkDataArray: [],
    limit: 10,
    limitCommited: 10,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      await axios.get(`http://api.aviationstack.com/v1/flights?access_key=998e5a4a99bc0905481195a2d92ba876&limit=${state.limitCommited}&flight_status=scheduled`)
        .then(res => {
          const flightsData = res.data.data;
          let linkDataArray = [];
          let nodeDataArray = [];
          for (let i = 0; i < flightsData.length; i++) {
            nodeDataArray.push({ text: flightsData[i].departure.airport, color: 'lightblue' })
            nodeDataArray.push({ text: flightsData[i].arrival.airport, color: 'green' })
          }
          nodeDataArray = nodeDataArray.map((item, index) => {
            item.key = index;
            item.loc = `${100 * index} ${100 * index}`;
            return item;
          })
          for (let i = 0; i < nodeDataArray.length; i++) {
            if (i % 2 || i === 0) {
              linkDataArray.push({ from: i, to: i + 1 })
            }
          }
          linkDataArray = linkDataArray.map((item, index) => {
            item.key = (index + 1) * -1;
            return item;
          })
          setState({
            ...state,
            linkDataArray: linkDataArray,
            nodeDataArray: nodeDataArray,
            flightsData: flightsData,
          })
        })
        .catch(err => console.log(err));
      setLoading(false);
    }

    fetchFlights();
  }, [state.limitCommited]);


  /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  const handleModelChange = (changes) => {
    // console.log(changes)
  }

  const handleDiagramDoubleClicked = (e) => {
    // console.log(e)
  }

  const handleFilterOnChange = (event, newValue) => {
    setState({
      ...state,
      limit: newValue,
    })
  }

  const handleFilterOnCommitted = (event, newValue) => {
    setState({
      ...state,
      limitCommited: newValue,
    })
  }

  return (
    <div className="App">
      <main className="main-block">
        <div className="flights-board-container">
          {loading ?
            <CircularProgress
              size="45px"
              color="primary"
              style={{ padding: 100 }}
            />
            :
            <FlightsBoard
              flightsData={state.flightsData}
              divClassName='diagram-component'
              nodeDataArray={state.nodeDataArray}
              linkDataArray={state.linkDataArray}
              onModelChange={handleModelChange}
              onDiagramDoubleClicked={handleDiagramDoubleClicked}
            />
          }
        </div>

        <div className="flights-timetable-container">
          {loading ?
            <CircularProgress
              size="45px"
              color="primary"
              style={{ padding: 100 }}
            />
            :
            <FlightsTimeTable flightsData={state.flightsData} />
          }
        </div>

        <div className="filter-slider-container">
          <FilterSlider
            limit={state.limit}
            onChange={handleFilterOnChange}
            onChangeCommited={handleFilterOnCommitted}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
