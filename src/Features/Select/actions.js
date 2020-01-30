import { Provider, createClient, useQuery } from 'urql';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import store from '../../store';

export default getMetrics = () => dispatch => {

    const client = createClient({
        url: 'https://react.eogresources.com/graphql',
    });

    const query = `
    {
        getMetrics
    }
    `;

    // const dispatch = useDispatch();

    const [result] = useQuery({
        query
    });

    const { fetching, data, error } = result;

    if (error) {
        dispatch(actions.metricApiErrorReceived({ error: error.message }));
        return;
      }
      if (!data) return;

      const { getMetrics } = data;
  
      dispatch(actions.metricsRecevied(getMetrics));


}