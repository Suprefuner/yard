import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  searchBoxInView: false,
  isMobileSidebarShow: false,
}

const generalSlice = createSlice({
  name: "general",
  initialState,
  reducers: {
    updateSearchboxInView: (state, { payload }) => {
      state.searchBoxInView = payload
    },
    showMobileSidebar: (state, { payload }) => {
      state.isMobileSidebarShow =
        payload !== undefined ? payload : !state.isMobileSidebarShow
    },
  },
})

export const { updateSearchboxInView, showMobileSidebar } = generalSlice.actions
export default generalSlice.reducer
