import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import customFetch from "../../utils/axios"
import { toast } from "react-toastify"

const initialUser = {
  photo: {
    publicId: "",
    url: "",
  },
  favoriteList: [],
}

const initialState = {
  isLoading: false,
  canEdit: false,
  user: initialUser,
  otherUser: initialUser,
  isModalOpen: false,
  formType: "register",
  isModalMessageShow: false,
  messageType: "",
}

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (user, thunkAPI) => {
    try {
      const res = await customFetch.post("/auth/register", user)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (user, thunkAPI) => {
    try {
      const res = await customFetch.post("/auth/login", user)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  "user/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await customFetch("/user/me")
      return data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const getUser = createAsyncThunk(
  "user/getUser",
  async (userId, thunkAPI) => {
    try {
      const { data } = await customFetch(`/user/${userId}`)
      return data.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateCurrentUser = createAsyncThunk(
  "user/updateCurrentUser",
  async (user, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/user/me", user)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateProfilePhoto = createAsyncThunk(
  "user/updateProfilePhoto",
  async (photo, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/user/updateMyPhoto", photo)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const followUser = createAsyncThunk(
  "user/followUser",
  async (otherUser, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/user/followUser", otherUser)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, thunkAPI) => {
    try {
      const { data } = await customFetch("/auth/logout")
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (password, thunkAPI) => {
    try {
      const { data } = await customFetch.patch(
        "/auth/update-password",
        password
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, thunkAPI) => {
    try {
      const { data } = await customFetch.post("/auth/forgot-password/", {
        email,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (reset, thunkAPI) => {
    const { email, password, passwordConfirm, token } = reset
    try {
      const { data } = await customFetch.patch(
        `/auth/reset-password/${token}`,
        { email, password, passwordConfirm }
      )
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const addListingToFavorite = createAsyncThunk(
  "user/addListingToFavorite",
  async (listing, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/user/updateMyFavorite", {
        listing,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateNumOfUnreadMessage = createAsyncThunk(
  "user/updateNumOfUnreadMessage",
  async (_, thunkAPI) => {
    try {
      const { data } = await customFetch("/user/getNumOfUnreadMessage")
      console.log(data)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openAuthModal: (state, { payload }) => {
      state.isModalOpen = true
      state.formType = payload
    },
    closeAuthModal: (state) => {
      state.isModalOpen = false
      state.isModalMessageShow = false
    },
    setFormType: (state, { payload }) => {
      state.formType = payload
    },
    showModalMessage: (state, { payload }) => {
      state.messageType = payload
      state.isModalMessageShow = true
    },
    changeEditMode: (state, { payload }) => {
      state.canEdit = payload
    },
    addListingToFavoriteLocally: (state, { payload }) => {
      state.user.favoriteList = state.user.favoriteList.includes(payload)
        ? state.user.favoriteList.filter((item) => item !== payload)
        : [...state.user.favoriteList, payload]
    },
    updateUserNumOfUnreadMessages: (state) => {
      state.user.numOfUnreadMessages += 1
    },
  },
  extraReducers: (builder) => {
    builder
      // =============================================================
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.isModalMessageShow = true
        state.messageType = "verify"
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload: { user } }) => {
        state.isLoading = false
        state.user = user
        state.isModalOpen = false
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // =============================================================
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.user = payload
        state.isModalOpen = false
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(getUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.otherUser = payload
      })
      .addCase(getUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = initialUser
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(updateCurrentUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCurrentUser.fulfilled, (state, { payload: { user } }) => {
        state.isLoading = false
        state.user = user
        toast.success(`user profile updated`)
      })
      .addCase(updateCurrentUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePassword.fulfilled, (state, { payload: { user } }) => {
        state.isLoading = false
        state.user = user
        toast.success(`password updated`)
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isLoading = false
        toast.error(`something went wrong, please try again`)
      })
      // =============================================================
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false
        state.isModalMessageShow = true
        state.messageType = "forgot password"
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false
        toast.error(`something went wrong, please try again`)
      })
      // =============================================================
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
        toast.success(`reset password successfully`)
      })
      .addCase(resetPassword.rejected, (state) => {
        state.isLoading = false
        toast.error(`something went wrong, please try again`)
      })
      // =============================================================
      .addCase(updateProfilePhoto.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateProfilePhoto.fulfilled, (state, { payload: { user } }) => {
        state.isLoading = false
        state.user = user
        toast.success(`profile photo updated`)
      })
      .addCase(updateProfilePhoto.rejected, (state) => {
        state.isLoading = false
        toast.error(`something went wrong, please try again`)
      })
      // =============================================================
      .addCase(followUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(followUser.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.user = payload.data
      })
      .addCase(followUser.rejected, (state) => {
        state.isLoading = false
      })
      // =============================================================
      .addCase(updateNumOfUnreadMessage.fulfilled, (state, { payload }) => {
        state.user.numOfUnreadMessages = payload.data
      })
  },
})

export const {
  openAuthModal,
  closeAuthModal,
  setFormType,
  changeEditMode,
  updateUserNumOfUnreadMessages,
} = userSlice.actions
export default userSlice.reducer
