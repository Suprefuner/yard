import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import customFetch from "../../utils/axios"

const initialListingState = {
  category: "computer & tech",
  condition: "brand new",
  createdBy: {
    user: {
      _id: "",
    },
    review: false,
  },
  price: 0,
  photos: [
    {
      publicId: "",
      url: "",
    },
  ],
  dealMethod: {
    meetUp: true,
    delivery: false,
  },
}

const initialState = {
  isLoading: false,
  createSuccess: false,
  isDelete: false,
  isUpdate: false,
  removedPhotos: [],
  listing: initialListingState,
}

export const buyListing = createAsyncThunk(
  "singleListing/buyListing",
  async (buyer, thunkAPI) => {
    try {
      const state = thunkAPI.getState().singleListing
      const { _id } = state.listing
      const { data } = await customFetch.patch(`/listing/${_id}/buyListing`, {
        buyer,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const getSingleListing = createAsyncThunk(
  "singleListing/getSingleListing",
  async (id, thunkAPI) => {
    try {
      const { data } = await customFetch(`/listing/${id}`)
      return data.listing
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const removeListingPhotoAtCloudinary = createAsyncThunk(
  "singleListing/removeListingPhotoAtCloudinary",
  async (photoPublicId, thunkAPI) => {
    try {
      await customFetch.patch("/listing/removeListingPhoto", {
        photoPublicId,
      })
      return photoPublicId
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const createListing = createAsyncThunk(
  "singleListing/createListing",
  async ({ listing, photos }, thunkAPI) => {
    try {
      const { data: uploadPhotoResult } = await customFetch.post(
        "/listing/uploadListingPhotos",
        photos
      )

      let photoRes = !!uploadPhotoResult.data.forEach
        ? [
            ...uploadPhotoResult.data.map((result) => ({
              publicId: result.value.public_id,
              url: result.value.secure_url,
            })),
          ]
        : [
            {
              publicId: uploadPhotoResult.data.public_id,
              url: uploadPhotoResult.data.secure_url,
            },
          ]

      const { data } = await customFetch.post("/listing", {
        ...listing,
        photos: photoRes,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateListing = createAsyncThunk(
  "singleListing/updateListing",
  async ({ listing, photos = [], removedPhotos, id }, thunkAPI) => {
    try {
      let photoRes = []
      // IF USER UPLOAD NEW PHOTOS, UPLOAD THEM TO CLOUDINARY
      if ([...photos].length) {
        const { data: uploadPhotoResult } = await customFetch.post(
          "/listing/uploadListingPhotos",
          photos
        )

        photoRes = !!uploadPhotoResult.data.forEach
          ? [
              ...uploadPhotoResult.data.map((result) => ({
                publicId: result.value.public_id,
                url: result.value.secure_url,
              })),
            ]
          : [
              {
                publicId: uploadPhotoResult.data.public_id,
                url: uploadPhotoResult.data.secure_url,
              },
            ]
      }

      const { data } = await customFetch.patch(`/listing/${id}`, {
        ...listing,
        photos: photoRes,
        removedPhotos,
      })

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateListingStatus = createAsyncThunk(
  "singleListing/updateListingStatus",
  async ({ id, status, soldTo, offerPrice }, thunkAPI) => {
    try {
      const { data } = await customFetch.patch(`/listing/${id}/updateStatus`, {
        status,
        soldTo,
        offerPrice,
      })
      return data.listing
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const deleteListing = createAsyncThunk(
  "singleListing/deleteListing",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState().singleListing
      const photoPublicId = state.listing.photos
        .map((photo) => photo.publicId)
        .join(",")

      await customFetch.patch("/listing/removeListingPhoto", {
        photoPublicId,
      })

      const { data } = await customFetch.delete(`/listing/${id}`, {
        params: { photoPublicId },
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const singleListingSlice = createSlice({
  name: "singleListing",
  initialState,
  reducers: {
    uploadPhotoToLocal: (state, { payload }) => {
      // FILTER OUT INITIAL EMPTY OBJECT
      state.localPhotos = payload.filter((item) => item.url || item.publicId)
    },
    uploadPhoto: (state, { payload }) => {
      // FILTER OUT INITIAL EMPTY OBJECT
      state.listing.photos = payload?.filter(
        (item) => item.url || item.publicId
      )
    },
    removePhoto: (state, { payload }) => {
      state.listing.photos = state.listing.photos.filter(
        (photo) => photo.url !== payload
      )
    },
    turnOffIsUpdate: (state) => {
      state.isUpdate = false
    },
    turnOffCreateSuccess: (state) => {
      state.createSuccess = false
    },
    clearSingleListing: (state) => {
      state.listing = initialListingState
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================================================
      .addCase(createListing.pending, (state) => {
        state.isLoading = true
        state.isDelete = false
      })
      .addCase(createListing.fulfilled, (state) => {
        state.isLoading = false
        state.createSuccess = true
        toast.success(`listing created`)
      })
      .addCase(createListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // ======================================================
      .addCase(getSingleListing.pending, (state) => {
        state.isLoading = true
        state.isDelete = false
      })
      .addCase(getSingleListing.fulfilled, (state, { payload }) => {
        state.listing = payload
        state.isLoading = false
      })
      .addCase(getSingleListing.rejected, (state) => {
        state.isLoading = false
        toast.error(`can't find listing, please try again`)
      })
      // ======================================================
      .addCase(updateListingStatus.pending, (state) => {
        state.isLoading = true
        state.isDelete = false
      })
      .addCase(updateListingStatus.fulfilled, (state, { payload }) => {
        state.listing.status = payload.status
        state.isLoading = false
      })
      .addCase(updateListingStatus.rejected, (state) => {
        state.isLoading = false
        toast.error(`can't find listing, please try again`)
      })
      // ======================================================
      .addCase(deleteListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listing = initialListingState
        // state.isDelete = true
        toast.success(payload)
      })
      .addCase(deleteListing.rejected, (state) => {
        state.isLoading = false
        toast.error(`can't delete listing, please try again`)
      })
      // ======================================================
      .addCase(removeListingPhotoAtCloudinary.pending, (state) => {
        state.isLoading = true
      })
      .addCase(
        removeListingPhotoAtCloudinary.fulfilled,
        (state, { payload }) => {
          state.isLoading = false
          state.listing.photos = state.listing.photos.filter(
            (photo) => photo.publicId !== payload
          )
          state.removedPhotos = [...state.removedPhotos, payload]
          toast.success(`photo deleted`)
        }
      )
      .addCase(removeListingPhotoAtCloudinary.rejected, (state) => {
        state.isLoading = false
        toast.error(`can't delete photo, please try again later`)
      })
      // ======================================================
      .addCase(updateListing.pending, (state) => {
        state.isLoading = true
        state.isUpdate = false
      })
      .addCase(updateListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listing = payload.listing
        state.removedPhotos = []
        state.isUpdate = true
        toast.success(`listing updated`)
      })
      .addCase(updateListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(`update listing failed, please try again later, ${payload}`)
      })
      // ======================================================
      .addCase(buyListing.pending, (state) => {
        state.isLoading = true
      })
      .addCase(buyListing.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.listing = payload.data
        // state.removedPhotos = []
        // state.isUpdate = true
        toast.success(`listing bought`)
      })
      .addCase(buyListing.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(`update listing failed, please try again later, ${payload}`)
      })
  },
})

export const {
  uploadPhoto,
  removePhoto,
  handleChange,
  uploadPhotoToLocal,
  clearSingleListing,
  turnOffIsUpdate,
  turnOffCreateSuccess,
  clearLocalRemovePhotos,
} = singleListingSlice.actions
export default singleListingSlice.reducer
