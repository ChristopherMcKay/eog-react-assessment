import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import { useSelector } from 'react-redux';

const MetricGraph = () => {

  const { metricValues } = useSelector(state => state.metrics);

  const [chartValues, setChartValues] = useState([]);

  useEffect(() => {

    let newArr = [];
    
    if(metricValues) {
      for(let i = 0; i < metricValues[0].measurements.length; i++) {

        let arrObj = {};

        let time = new Date(metricValues[0].measurements[i].at).toLocaleTimeString();
        let date = new Date(metricValues[0].measurements[i].at).toLocaleDateString();

        arrObj.timestamp = date + ' ' + time;

        for(let j = 0; j < metricValues.length; j++) {
        
        arrObj[metricValues[j].measurements[i].metric] = metricValues[j].measurements[i].value;
        
     }
     newArr.push(arrObj);
    }
  }

  setChartValues(newArr);
    
  }, [metricValues])

  const formatDate = (tickItem) => {

    let time = tickItem.split(' ')[1];

    return time;
  }

  return (
      
    <React.Fragment>
        { chartValues.length > 0 ?  
          <LineChart
          width={1200}
          height={500}
          data={chartValues}
          margin={{
            top: 5, right: 10, left: 10, bottom: 5,
          }}
        >
          <XAxis dataKey="timestamp" interval={210} tickFormatter={formatDate} padding={{left: 30}} />
          <YAxis yAxisId="1" />
          <YAxis yAxisId="2" />
          <YAxis yAxisId="3" />
          <Tooltip />
          <Line type="monotone" yAxisId="1" dot={false} dataKey="waterTemp" stroke="#82ca9d" />
          <Line type="monotone" yAxisId="2" dot={false} dataKey="casingPressure" stroke="blue" />
          <Line type="monotone" yAxisId="3" dot={false} dataKey="injValveOpen" stroke="orange" />
          <Line type="monotone" yAxisId="1" dot={false} dataKey="flareTemp" stroke="red" />
          <Line type="monotone" yAxisId="1" dot={false} dataKey="oilTemp" stroke="black" />
          <Line type="monotone" yAxisId="2" dot={false} dataKey="tubingPressure" stroke="purple" />
        </LineChart>
        : null}
    
    </React.Fragment>
  );
}

export default MetricGraph;