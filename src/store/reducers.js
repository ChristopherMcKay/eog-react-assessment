import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricReducer } from '../Features/Select/reducer';

export default {
  weather: weatherReducer,
  metrics: metricReducer
};
