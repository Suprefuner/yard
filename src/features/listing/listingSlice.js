import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import customFetch from "../../utils/axios"
import { toast } from "react-toastify"

const initialListings = {
  photos: [
    {
      publicId: "",
      url: "",
    },
  ],
}

const initialState = {
  isLoading: false,
  listings: [initialListings],
  recentListings: [initialListings],
  popularListings: [initialListings],
  page: 1,
  pages: 1,
  results: 0,
}

export const getAllListing = createAsyncThunk(
  "listing/getAllListing",
  async (query, thunkAPI) => {
    try {
      const { data } = await customFetch(`/listing`, { params: query })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        `something went wrong can't get listing, please try again later`
      )
    }
  }
)

export const getRecentlyListing = createAsyncThunk(
  "listing/getRecentlyListing",
  async (query, thunkAPI) => {
    try {
      const { data } = await customFetch(`/listing`, { params: query })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        `something went wrong can't get listing, please try again later`
      )
    }
  }
)

export const getPopularListing = createAsyncThunk(
  "listing/getPopularListing",
  async (query, thunkAPI) => {
    try {
      const { data } = await customFetch(`/listing`, { params: query })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        `something went wrong can't get listing, please try again later`
      )
    }
  }
)

export const loadMore = createAsyncThunk(
  "listing/test",
  async (query, thunkAPI) => {
    try {
      const { data } = await customFetch(`/listing`, { params: query })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.data.response)
    }
  }
)

export const getAllMyListing = createAsyncThunk(
  "listing/getAllMyListing",
  async (userId, thunkAPI) => {
    try {
      const { data } = await customFetch("/listing/allMyListings", {
        params: { userId },
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(`can't get current user listing`)
    }
  }
)

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // =============================================================
      .addCase(getAllMyListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMyListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listings = payload.data
        state.page = payload.page
        state.pages = payload.pages
        state.results = payload.results
      })
      .addCase(getAllMyListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(getAllListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listings = payload.data
        state.page = payload.page
        state.pages = payload.pages
        state.results = payload.results
      })
      .addCase(getAllListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(getRecentlyListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getRecentlyListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.recentListings = payload.data
      })
      .addCase(getRecentlyListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(getPopularListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPopularListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.popularListings = payload.data
      })
      .addCase(getPopularListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(loadMore.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadMore.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listings = [...state.listings, ...payload.data]
        state.page = +payload.page
      })
      .addCase(loadMore.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const { clearListings } = listingSlice.actions
export default listingSlice.reducer
