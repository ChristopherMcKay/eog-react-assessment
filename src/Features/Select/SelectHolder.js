import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';

import SelectMetric from './SelectMetric';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import store from '../../store';

const client = createClient({
    url: 'https://react.eogresources.com/graphql',
  });
  
  const query = `
  {
    getMetrics
  }
  `;



  export default () => {
    return (
      <Provider value={client}>
        <SelectMetric />
      </Provider>
    );
  };


const SelectHolder = () => {


  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });


  const { fetching, data, error } = result;


  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics } = data;

    dispatch(actions.metricsRecevied(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

 

    return(
      <div>
        <SelectMetric />
      </div>
        
    );

}