import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `

  query ($selectedMetric: String!) {
  getLastKnownMeasurement(metricName: $selectedMetric) {
    metric
    at
    value
    unit
}
}

`;



const useStyles = makeStyles({
  card: {
    width: 200,
    backgroundColor: 'rgb(226,231,238)',
    margin: 0
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

  const { selectedMetric, currentMetricValue } = useSelector(state => state.metrics);
  

  const [result] = useQuery({
    query,
    variables: {
      selectedMetric
    },
    pollInterval: 1300
  });

  const { fetching, data, error } = result;

  console.log(data);

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getLastKnownMeasurement } = data;

    dispatch(actions.currentMetricValueRecevied(getLastKnownMeasurement));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <React.Fragment>
    { currentMetricValue ? 
    <Card className={classes.card}>
    <CardContent>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        {currentMetricValue.metric}
      </Typography>
      <Typography variant="h5" component="h2">
      {currentMetricValue.value}
      </Typography>
    </CardContent>
  </Card>
  : null
  }

    
    </React.Fragment>
  );
}
