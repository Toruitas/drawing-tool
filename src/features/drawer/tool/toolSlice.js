import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'tool',
  initialState: {
    tool: "select",
    minVertices: 0,
    maxVertices: 0,
  },
  reducers: {
    selectATool: (state, action) => {
        let toolToSelect = action.payload;
        state.tool = toolToSelect;
        if (toolToSelect === "line" || toolToSelect === "rect"){
            state.vertices = 2;
        }
        if (toolToSelect === "select"){
            state.vertices = 0;
        }
    }
    // selectSelectTool: state =>{
    //     state.tool = "select";
    //     state.minVertices = 0;
    //     state.maxVertices = 0;
    // },
    // selectLineTool: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
    //   state.tool = "line";
    //   state.minVertices = 2;
    //   state.maxVertices = 2;
    // },
    // selectRectTool: state => {
    //     state.tool = "line";
    //     state.minVertices = 2;
    //     state.maxVertices = 2;
    // },
    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // },
  },
});

export const { selectATool } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
// export const incrementAsync = amount => dispatch => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectSelectedTool = state => state.tool.tool;
export const selectVertices = state => state.tool.vertices;

export default slice.reducer;
