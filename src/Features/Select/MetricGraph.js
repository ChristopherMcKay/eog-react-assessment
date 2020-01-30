import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, } from 'recharts';

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

const useStyles = makeStyles({
  card: {
    width: 200,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});



export default () => {
  return (
    <Provider value={client}>
      <MetricCard />
    </Provider>
  );
};

const MetricCard = () => {

  const classes = useStyles();

  const dispatch = useDispatch();

  const { selectedMetric, pastMetricValues } = useSelector(state => state.metrics);

  const [result] = useQuery({
    query,
    variables: {
        selectedMetric,
        startTime
    },
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

  return (
      
    <div>
        { pastMetricValues ?  <LineChart
        width={1000}
        height={450}
        data={pastMetricValues}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="at" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="value" stroke="#82ca9d" />
      </LineChart>
        : null}
    
    </div>
  );
}