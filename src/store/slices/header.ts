import {createSlice} from '@reduxjs/toolkit';

export interface HeaderData {
    routeIndex?: number
}

const initialState: HeaderData = {};

const slice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        displayRoute: (state, {payload: routeIndex}) => {
            state.routeIndex = routeIndex;
        }
    }
});

export const {displayRoute} = slice.actions;

export default slice.reducer;