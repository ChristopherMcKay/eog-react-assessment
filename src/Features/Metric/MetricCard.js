import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';

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

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const createQuery = (selectedMetric) => {

  let query = `query ($startTime: Timestamp) {
    getMultipleMeasurements(input: [`

  for (let i = 0; i < selectedMetric.length; i++) {
    query += `{
      metricName: "${selectedMetric[i]}",
      after: $startTime
    },`
}

  query += `]) {
    metric
    measurements {
      metric
      value
      at
    }
  }
  }

`;

return query;

}

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

  const classes = useStyles();

  const dispatch = useDispatch();

  const { selectedMetric, metricValues } = useSelector(state => state.metrics);

  const query = createQuery(selectedMetric);

  const [result] = useQuery({
    query,
    variables: {
      startTime
    },
    pollInterval: 1300
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;

    dispatch(actions.metricValueRecevied(getMultipleMeasurements));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <React.Fragment>
    { metricValues ? <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}> {metricValues.map(metric => {
       return (
        <Card className={classes.card} key={Math.random()}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            {metric.metric}
          </Typography>
          <Typography variant="h5" component="h2">
          {metric.measurements[0].value}
          </Typography>
        </CardContent>
      </Card>
       )
    }) } </div>
  : null
  }
    </React.Fragment>
  );
}
