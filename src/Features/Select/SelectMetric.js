import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';


const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
{
  getMetrics
}
`;


const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 160,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));


  export default () => {
    return (
      <Provider value={client}>
        <SelectMetric />
      </Provider>
    );
  };


const SelectMetric = () => {

    const classes = useStyles();

    const [metric, setMetric] = React.useState('');

    const inputLabel = React.useRef('Metric');

    const [labelWidth, setLabelWidth] = React.useState(0);

    useEffect(() => {
      setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

  const handleChange = event => {
    setMetric(event.target.value);
  };

  const dispatch = useDispatch();

  const { metrics } = useSelector(state => state.metrics);

  useEffect(() => {
    dispatch(actions.selectMetric(metric));
  }, [metric]);

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


  const outputList = () => {
    return metrics.map(item => {
      return <MenuItem value={item} key={Math.random()}>
              {item}
          </MenuItem>
    })
  }

 

    return(
      <div>

      { metrics ? 
            <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel  id="demo-simple-select-outlined-label">
                Metric
            </InputLabel>
            <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={metric}
            onChange={handleChange}
            labelWidth={labelWidth}
            >
            { outputList() }
            </Select>
        </FormControl>
      
    : <p>shit</p>
    }
      </div>
        
    );

}
