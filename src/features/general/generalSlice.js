import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  searchBoxInView: false,
  isMobileSidebarShow: false,
  showFooter: true,
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
    toggleFooter: (state, { payload }) => {
      state.showFooter = payload
    },
  },
})

export const { updateSearchboxInView, showMobileSidebar, toggleFooter } =
  generalSlice.actions
export default generalSlice.reducer
