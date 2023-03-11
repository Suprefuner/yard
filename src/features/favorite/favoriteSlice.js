import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import customFetch from "../../utils/axios"
import { toast } from "react-toastify"

const initialState = {
  favoriteList: [],
  isLoading: true,
}

export const getMyFavorite = createAsyncThunk(
  "favorite/getMyFavorite",
  async (_, thunkAPI) => {
    try {
      const { data } = await customFetch("/user/myFavorite")
      return data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const addLocalFavoriteListingToServer = createAsyncThunk(
  "favorite/addLocalFavoriteListingToServer",
  async (favoriteList, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/user/updateMyFavorite", {
        listing: favoriteList,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    toggleListingToFavoriteLocally: (state, { payload }) => {
      if (state.favoriteList.map((item) => item._id).includes(payload._id)) {
        state.favoriteList = state.favoriteList.filter(
          (listing) => listing._id !== payload._id
        )
      } else {
        state.favoriteList = [...state.favoriteList, payload]
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // =============================================================
      .addCase(getMyFavorite.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMyFavorite.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.favoriteObjects = payload
      })
      .addCase(getMyFavorite.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(addLocalFavoriteListingToServer.pending, (state) => {
        state.isLoading = true
        state.isUpdate = false
      })
      .addCase(addLocalFavoriteListingToServer.fulfilled, (state) => {
        state.isLoading = false
        state.isUpdate = true
      })
      .addCase(addLocalFavoriteListingToServer.rejected, (state) => {
        state.isLoading = false
      })
  },
})

export const { toggleListingToFavoriteLocally } = favoriteSlice.actions
export default favoriteSlice.reducer
