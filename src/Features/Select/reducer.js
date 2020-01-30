import { createSlice } from 'redux-starter-kit';

const initialState = {
  metrics: [],
  currentMetricValue: null,
  pastMetricValues: null
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsRecevied: (state, action) => {
      const metrics = action.payload;
      state.metrics = metrics;
    },
    currentMetricValueRecevied: (state, action) => {
        const currentMetricValue = action.payload;
        state.currentMetricValue = currentMetricValue;
      },
    pastMetricValuesRecevied: (state, action) => {
        const pastMetricValues = action.payload;
        state.pastMetricValues = pastMetricValues;
      },
    metricApiErrorReceived: (state, action) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;