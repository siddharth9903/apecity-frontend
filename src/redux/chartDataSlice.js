import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {
        setFetchedData: (state, action) => {
            const { bondingCurveAddress, data } = action.payload;
            state[bondingCurveAddress] = data;
        },
    },
});

export const { setFetchedData } = dataSlice.actions;
export default dataSlice.reducer;