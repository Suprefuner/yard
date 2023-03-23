import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { toast } from "react-toastify"
import customFetch from "../../utils/axios"

const initialCurrentChatState = {
  participants: [{ photo: { url: "" } }],
}

const initialState = {
  isLoading: false,
  chatList: [],
  currentChat: initialCurrentChatState,
  messages: [],
  onlineUsers: [],
}

export const getAllMyChat = createAsyncThunk(
  "chat/getAllMyChat",
  async (_, thunkAPI) => {
    try {
      const { data } = await customFetch("/chat")
      console.log(data)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getChatMessages = createAsyncThunk(
  "chat/getChatMessages",
  async (chatId, thunkAPI) => {
    try {
      const { data } = await customFetch("/message", {
        params: chatId,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (
    { userId, listing, text, image, type, offerType, offerPrice },
    thunkAPI
  ) => {
    try {
      const { data } = await customFetch.post("/chat", {
        userId,
        listing,
        text,
        image,
        type,
        offerType,
        offerPrice,
      })

      const user = thunkAPI.getState("user").user
      console.log(data)
      return { data, user }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (
    { chat, receiver, text, image, type, offerType, offerPrice },
    thunkAPI
  ) => {
    try {
      const { data } = await customFetch.post("/message", {
        chat,
        receiver,
        text,
        image,
        type,
        offerType,
        offerPrice,
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateChatWithOffer = createAsyncThunk(
  "chat/updateChatWithOffer",
  async ({ chatId, offer, offerStatus, offerPrice }, thunkAPI) => {
    try {
      const { data } = await customFetch.patch("/chat", {
        chatId,
        offer,
        offerStatus,
        offerPrice,
      })
      console.log(data)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addNewChat: (state, { payload }) => {
      state.chatList = [payload, ...state.chatList]
      toast.success(
        `${payload.participants[0].username} just sent you a new message`
      )
    },
    setCurrentChat: (state, { payload }) => {
      state.currentChat = state.chatList.find((chat) => chat._id === payload)
    },
    updateMessages: (state, { payload }) => {
      state.messages = [...state.messages, payload]
    },
    setOnlineUsers: (state, { payload }) => {
      state.onlineUsers = payload
    },
    updateUserLastOnline: (state, { payload }) => {
      if (state.currentChat.participants[0]._id === payload)
        state.currentChat.participants[0].lastOnline = Date.now()
    },
    updateChatLastMsgAndStatus: (state, { payload }) => {
      const {
        chat: chatId,
        msg,
        message,
        status,
        createdAt,
        type,
        offerType,
        offerPrice,
      } = payload

      if (!type) {
        state.chatList = state.chatList.map((chat) =>
          chat._id !== chatId
            ? chat
            : {
                ...chat,
                lastMessage: { message },
                hasUnreadNewMsg: status,
                createdAt,
              }
        )
      }

      if (type && type === "offer") {
        state.chatList = state.chatList.map((chat) =>
          chat._id !== chatId
            ? chat
            : {
                ...chat,
                lastMessage: {
                  message,
                  type: type,
                  offerType: offerType,
                  offerPrice: offerPrice,
                },
                offer: offerType === "made",
                offerPrice: offerPrice,
                hasUnreadNewMsg: status,
                createdAt,
              }
        )

        if (state.currentChat._id === chatId) {
          state.currentChat = {
            ...state.currentChat,
            offer: offerType === "made",
            offerPrice: offerType === "cancelled" ? undefined : offerPrice,
            offerStatus:
              offerType === "made"
                ? "pending"
                : offerType === "cancelled"
                ? undefined
                : "accepted",
          }
        }
      }
    },
    updateChatOfferStatus: (state, { payload }) => {
      state.offer = payload
    },
    readUnreadMessage: (state, { payload }) => {
      state.chatList = state.chatList.map((chat) =>
        chat._id !== payload
          ? chat
          : {
              ...chat,
              hasUnreadNewMsg: false,
            }
      )
    },
    updateLocalMessagesStatus: (state) => {
      state.messages = state.messages.map((msg) =>
        msg.status === "seen" ? msg : { ...msg, status: "seen" }
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllMyChat.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllMyChat.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.chatList = payload.data
      })
      .addCase(getAllMyChat.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // ==========================================================
      .addCase(getChatMessages.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getChatMessages.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.messages = payload.data
      })
      .addCase(getChatMessages.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // ==========================================================
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(sendMessage.fulfilled, (state, { payload }) => {
        state.isLoading = false
        state.messages = [...state.messages, payload.data]

        if (payload.data.type !== "offer") return

        if (payload.data.offerType === "made") {
          state.currentChat = {
            ...state.currentChat,
            offer: true,
            offerPrice: payload.data.offerPrice,
            offerStatus: "pending",
          }
        }

        if (payload.data.offerType === "cancelled") {
          state.currentChat = {
            ...state.currentChat,
            offer: false,
            offerPrice: undefined,
            offerStatus: undefined,
          }
        }

        if (payload.data.offerType === "accepted") {
          state.currentChat = {
            ...state.currentChat,
            offer: true,
            offerPrice: payload.data.offerPrice,
            offerStatus: "accepted",
            listing: { ...state.currentChat.listing, status: "sold" },
          }
        }

        state.chatList = state.chatList.map((chat) => {
          if (chat._id !== payload.data.chat) {
            return chat
          }

          if (payload.data.offerType === "made") {
            return {
              ...chat,
              offer: true,
              offerPrice: payload.data.offerPrice,
              offerStatus: "pending",
            }
          }

          if (payload.data.offerType === "cancelled") {
            return {
              ...chat,
              offer: false,
              offerPrice: undefined,
              offerStatus: undefined,
            }
          }

          if (payload.data.offerType === "accepted") {
            return {
              ...chat,
              offer: true,
              offerPrice: payload.data.offerPrice,
              offerStatus: "accepted",
            }
          }
        })
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // ==========================================================
      .addCase(updateChatWithOffer.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateChatWithOffer.fulfilled, (state, { payload }) => {
        state.isLoading = false
        const newChat = payload.data
        const targetChat = state.chatList.find(
          (chat) => chat._id === newChat._id
        )

        targetChat.offer = newChat.offer
        targetChat.offerPrice = newChat.offerPrice
        targetChat.offerStatus = newChat.offerStatus

        state.chatList = state.chatList.map((chat) =>
          chat._id !== newChat._id ? chat : targetChat
        )

        state.currentChat = {
          ...state.currentChat,
          offer: newChat.offer,
          offerPrice: newChat.offerPrice,
          offerStatus: newChat.offerStatus,
        }
      })
      .addCase(updateChatWithOffer.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      // ==========================================================
      .addCase(createChat.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createChat.fulfilled, (state, { payload }) => {
        const { data, user } = payload

        state.isLoading = false
        state.chatList = [data.data, ...state.chatList]
        state.currentChat = data.data
        state.messages = [
          {
            ...data.data.lastMessage,
            chat: data.data._id,
            sender: user.user._id,
            receiver: data.data.participants[0]._id,
            status: "delivered",
          },
        ]
      })
      .addCase(createChat.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const {
  addNewChat,
  setCurrentChat,
  updateMessages,
  setOnlineUsers,
  updateUserLastOnline,
  updateChatLastMsgAndStatus,
  readUnreadMessage,
  updateLocalMessagesStatus,
  updateChatOfferStatus,
} = chatSlice.actions
export default chatSlice.reducer
