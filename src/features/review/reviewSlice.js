import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import customFetch from "../../utils/axios"
import { toast } from "react-toastify"

const initialCurrentReview = {
  rating: 1,
  content: "",
  isLock: false,
}

const initialState = {
  isLoading: false,
  isModalOpen: false,
  currentReview: initialCurrentReview,
  reviews: [],
}

export const getAllMyReviews = createAsyncThunk(
  "review/getAllMyReviews",
  async (id, thunkAPI) => {
    try {
      const { data } = await customFetch("/review", { id })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const createReview = createAsyncThunk(
  "review/createReview",
  async (listingId, thunkAPI) => {
    try {
      const state = thunkAPI.getState().review
      const { data } = await customFetch.post("/review", {
        listing: listingId,
        rating: state.currentReview.rating,
        content: state.currentReview.content,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    switchReviewModal: (state, { payload }) => {
      state.isModalOpen = payload
      if (!payload) state.currentReview = initialCurrentReview
    },
    updateCurrentReview: (state, { payload }) => {
      state.currentReview[payload.name] = payload.value
    },
  },
  extraReducers: (builder) => {
    builder
      // =============================================================
      .addCase(createReview.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createReview.fulfilled, (state) => {
        state.isLoading = false
        state.isModalOpen = false
        toast.success(`create review`)
      })
      .addCase(createReview.rejected, (state, { payload }) => {
        state.isLoading = false
        state.isModalOpen = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(getAllMyReviews.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMyReviews.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.reviews = payload.data
      })
      .addCase(getAllMyReviews.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const { switchReviewModal, updateCurrentReview } = reviewSlice.actions
export default reviewSlice.reducer
