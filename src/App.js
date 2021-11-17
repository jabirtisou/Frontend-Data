import './App.css';
import { getData } from './fetch';
import { useEffect, useState } from 'react';
import BarChart from './BarChart';
import WorldMap from './WorldMap';
import * as d3 from 'd3';

function App() {
  const [barData, setBarData] = useState(null);
  const [year, setYear] = useState(2011);
  const years = [
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ];
  const [mapData, setMapData] = useState(null);

  const handleChange = (e) => {
    setYear(e.target.value);
  };

  useEffect(() => {
    const fetchData = async (selectedYear) => {
      const data = await getData(+selectedYear);
      const topojson = await d3.json(
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'
      );
      setMapData(topojson);
      setBarData(data);
    };

    fetchData(year);
  }, [year]);

  return (
    <div className='App'>
      <h1>BigMac Price Index</h1>
      <div className='year'>
        <p>Select a year: </p>
        <select value={year} onChange={handleChange}>
          {years &&
            years.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
        </select>
      </div>
      {barData && <BarChart data={barData} />}
      {mapData && barData && <WorldMap data={mapData} countries={barData} />}
    </div>
  );
}

export default App;
