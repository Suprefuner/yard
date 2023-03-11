import { createSlice } from "@reduxjs/toolkit"

const initialFilters = {
  search: "",
  category: "all",
  brand: "",
  sort: "latest",
  condition: "all",
  price: {
    minPrice: 0,
    maxPrice: 0,
  },
}

const initialOptionsShow = {
  category: false,
  sort: false,
  condition: false,
  price: false,
}

const initialState = {
  isLoading: false,
  filters: initialFilters,
  filtersOptionsShow: initialOptionsShow,
}

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    showOptions: (state, { payload }) => {
      // ONLY ALLOW FILTER SHOWS IT'S OPTIONS ONCE AT A TIME
      Object.keys(state.filtersOptionsShow).forEach((item) => {
        state.filtersOptionsShow[item] =
          item === payload ? !state.filtersOptionsShow[item] : false
      })
    },
    updateFilter: (state, { payload }) => {
      const { name, value } = payload
      state.filters[name] = value
      state.filtersOptionsShow[name] = false
    },
    clearSearchField: (state) => {
      state.filters.search = ""
    },
    clearFilter: (state, { payload }) => {
      if (payload === "all") {
        state.filters = initialFilters
        state.filtersOptionsShow = initialOptionsShow
      } else {
        Object.keys(initialFilters).forEach((filter) => {
          if (filter === "search") return
          state.filters[filter] = initialFilters[filter]
        })
      }
    },
  },
})

export const { updateFilter, clearFilter, showOptions, clearSearchField } =
  filterSlice.actions
export default filterSlice.reducer
