import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './chartDataSlice';

const store = configureStore({
    reducer: {
        data: dataReducer,
    },
});

export default store;