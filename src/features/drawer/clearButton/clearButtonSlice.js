import {createSlice} from '@reduxjs/toolkit';

export const slice = createSlice({
    name:"clear",
    initialState:{
        clear:false
    },
    reducers: {
        clearCanvas: (state, action) =>{
            state.clear = true;
        },
        resetClear: (state, action) =>{
            state.clear = false;
        }
    }
})

export const {clearCanvas, resetClear} = slice.actions;

export const selectClearCanvas = state => state.clear.clear;

export default slice.reducer;