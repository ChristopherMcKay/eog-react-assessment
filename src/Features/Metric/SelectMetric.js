import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '@material-ui/core/Chip';

import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 160,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const getStyles = (metric, stateMetrics, theme) => {
    return {
      fontWeight:
        stateMetrics.indexOf(metric) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

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

const SelectMetric = () => {

    const classes = useStyles();
    const theme = useTheme();

  const [stateMetrics, setMetrics] = React.useState([]);

  const handleChange = event => {
    setMetrics(event.target.value);
  };

  const dispatch = useDispatch();

  const { metrics } = useSelector(state => state.metrics);

  useEffect(() => {
    dispatch(actions.selectMetric(stateMetrics));
  }, [stateMetrics, dispatch]);

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
      <React.Fragment>
        <FormControl className={classes.formControl}>
        <InputLabel id="demo-mutiple-chip-label">Metric</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          value={stateMetrics}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metrics.map(metric => (
            <MenuItem key={metric} value={metric} style={getStyles(metric, stateMetrics, theme)}>
              {metric}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
    </React.Fragment>
        
    );
}
