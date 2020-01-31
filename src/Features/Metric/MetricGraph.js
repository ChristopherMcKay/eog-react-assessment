import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `

  query ($selectedMetric: String!, $startTime: Timestamp) {
  getMeasurements(input: {
      metricName: $selectedMetric,
      after: $startTime
  }) {
    metric
    at
    value
    unit
}
}

`;

const currentTime = Date.now();

const startTime = currentTime - 30 * 60000;


export default () => {
  return (
    <Provider value={client}>
      <MetricCard />
    </Provider>
  );
};

const MetricCard = () => {

  const dispatch = useDispatch();

  const { selectedMetric, pastMetricValues } = useSelector(state => state.metrics);

  const [result] = useQuery({
    query,
    variables: {
        selectedMetric,
        startTime
    },
    pollInterval: 1300
  });

  const { data, error } = result;

  console.log(data);


  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMeasurements } = data;

    dispatch(actions.pastMetricValuesRecevied(getMeasurements));
  }, [dispatch, data, error]);

  const formatDate = (tickItem) => {
    let date = new Date(tickItem);
    let hour = date.getHours();
    let min = date.getMinutes();
    let time = `${hour}:${min}`;
    return time;
  }

  return (
      
    <React.Fragment>
        { pastMetricValues ?  <LineChart
        width={1200}
        height={500}
        data={pastMetricValues}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="at" tickFormatter={formatDate} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
        : null}
    
    </React.Fragment>
  );
}