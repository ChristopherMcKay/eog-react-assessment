import React from 'react';

import SelectMetric from './SelectMetric';
import MetricCard from './MetricCard';
import MetricGraph from './MetricGraph';

import { useSelector } from 'react-redux';

const Metric = () => {

    const { selectedMetric, error } = useSelector(state => state.metrics);

    return(
        <div style={{textAlign: 'center'}}>

            <SelectMetric />
            
            { selectedMetric.length > 0 ? <div> <div style={{ display:'flex', justifyContent:'center', width: '100%' }}><MetricCard /></div> <MetricGraph /></div>
            : null }

            { error ? <p>{error}</p> : null }

        </div>
    )
}

export default Metric;