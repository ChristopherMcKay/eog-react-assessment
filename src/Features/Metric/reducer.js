import { createSlice } from 'redux-starter-kit';

const initialState = {
  metrics: [],
  selectedMetric: [],
  metricValues: null,
  error: null
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsRecevied: (state, action) => {
      const metrics = action.payload;
      state.metrics = metrics;
    },
    selectMetric: (state, action) => {
        const selectedMetric = action.payload;
        state.selectedMetric = selectedMetric;
      },
    metricValueRecevied: (state, action) => {
        const metricValues = action.payload;
        state.metricValues = metricValues;
      },
    metricApiErrorReceived: (state, action) => {
        const { error } = action.payload;
        state.error = error;
  }
}
});

export const reducer = slice.reducer;
export const actions = slice.actions;