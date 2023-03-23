import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { io } from "socket.io-client"
import {
  HomePage,
  VerifyEmailPage,
  CategoryPage,
  SingleListingPage,
  FavoritePage,
  ErrorPage,
  ProfileEditPage,
  ProfileListingPage,
  ProfileReviewPage,
  ProfilePageShareLayout,
  AuthPage,
  ChatPage,
  CreateListingPage,
  ResetPasswordPage,
  AuthProtectedRoute,
  VerifyProtectedRoute,
  EditListingPage,
  ListingsPage,
} from "./pages"
import {
  Navbar,
  Footer,
  AuthFormModal,
  SmoothScroll,
  Searchbox,
} from "./components"
import {
  NavbarMobile,
  BottomNavbarMobile,
  SidebarMobile,
} from "./components/mobile"
import { isDesktop } from "./utils/helpers"
import {
  getCurrentUser,
  updateUserNumOfUnreadMessages,
} from "./features/user/userSlice"
import {
  setOnlineUsers,
  updateUserLastOnline,
  updateChatLastMsgAndStatus,
} from "./features/chat/chatSlice"
import { getAllMyChat } from "./features/chat/chatSlice"
import { toast } from "react-toastify"

function App() {
  const { currentChat } = useSelector((store) => store.user)
  const { searchBoxInView, showFooter } = useSelector((store) => store.general)
  const { chatList } = useSelector((store) => store.chat)
  const { user, isModalOpen } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const socket = useRef()

  useEffect(() => {
    dispatch(getCurrentUser())
    socket.current = io("ws://localhost:5000")
  }, [])

  useEffect(() => {
    if (!user._id) return
    socket.current.emit("addUser", user._id)
    socket.current.on("getUsers", (users) => {
      dispatch(setOnlineUsers(users))
    })
    socket.current.on("updateUserLastOnline", (userId) => {
      dispatch(updateUserLastOnline(userId))
    })

    dispatch(getAllMyChat())
  }, [user._id])

  // useEffect(() => {
  //   const handleUpdateMessageStatus = ({ chatId }) => {
  //     if (currentChat._id !== chatId) return
  //     dispatch(updateLocalMessagesStatus())
  //   }

  //   socket?.on("updateMessageStatus", handleUpdateMessageStatus)
  //   return () => socket?.off("updateMessageStatus", handleUpdateMessageStatus)
  // }, [currentChat])

  useEffect(() => {
    const handleGetMessage = ({ senderId, msg }) => {
      const messageObject = {
        chat: msg.chat,
        createdAt: Date.now(),
      }

      if (!msg.type) {
        messageObject.message = msg.text
          ? { text: msg.text }
          : { image: msg.image }
      }

      if (msg.type && msg.type === "offer") {
        messageObject.message = { text: "" }
        messageObject.type = "offer"
        messageObject.offerType = msg.offerType
        messageObject.offerPrice = msg.offerPrice
      }

      // IF THE MESSAGE FROM CURRENT CHAT
      if (
        senderId === currentChat?.participants[0]._id &&
        msg.chat === currentChat?._id
      ) {
        setArrivalMessage({
          ...messageObject,
          sender: senderId,
          receiver: user._id,
        })
        dispatch(updateChatLastMsgAndStatus({ ...messageObject }))
      }

      // IF THE MESSAGE NOT FROM CURRENT CHAT
      else {
        const chat = chatList.find((chat) => chat._id === msg.chat)
        const user = chat?.participants[0]
        if (!user) return

        dispatch(updateChatLastMsgAndStatus({ ...messageObject, status: true }))
        dispatch(updateUserNumOfUnreadMessages())

        toast.success(`${user.username} just sent you a new message`, {
          toastId: "new message",
          hideProgressBar: true,
        })
      }
    }

    socket?.current?.on("getMessage", handleGetMessage)
    return () => socket?.current?.off("getMessage", handleGetMessage)
  }, [chatList, currentChat])

  return (
    <div className="App">
      <BrowserRouter>
        <SmoothScroll>
          {isModalOpen && <AuthFormModal />}
          {isDesktop() ? <Navbar /> : <NavbarMobile />}
          {isDesktop() && (
            <div
              className={`fixed -top-1 w-full z-[45] bg-slate-700 py-1 px-[28rem] transition-all ${
                !searchBoxInView && "top-6"
              } `}
            >
              <Searchbox outline={"none"} />
            </div>
          )}
          <SidebarMobile />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="auth" element={<AuthPage />} />
            <Route
              path="verify-email"
              element={
                <VerifyProtectedRoute>
                  <VerifyEmailPage />
                </VerifyProtectedRoute>
              }
            />
            <Route
              path="reset-password"
              element={
                <VerifyProtectedRoute>
                  <ResetPasswordPage />
                </VerifyProtectedRoute>
              }
            />

            <Route path="profile" element={<ProfilePageShareLayout />}>
              <Route index element={<ProfileListingPage />} />
              <Route path=":userId" element={<ProfileListingPage />} />
              <Route path="reviews/:userId" element={<ProfileReviewPage />} />
              <Route path="reviews" element={<ProfileReviewPage />} />
              <Route
                path="edit"
                element={
                  <AuthProtectedRoute>
                    <ProfileEditPage />
                  </AuthProtectedRoute>
                }
              />
            </Route>
            <Route path="create-listing" element={<CreateListingPage />} />
            <Route path="category/:category" element={<CategoryPage />} />
            <Route path="listing" element={<ListingsPage />} />
            <Route path="listing/:id/edit" element={<EditListingPage />} />
            <Route
              path="listing/:id"
              element={<SingleListingPage socket={socket.current} />}
            />
            <Route
              path="favorite"
              element={
                <AuthProtectedRoute>
                  <FavoritePage />
                </AuthProtectedRoute>
              }
            />
            <Route
              path="chat"
              element={
                <AuthProtectedRoute>
                  <ChatPage socket={socket.current} />
                </AuthProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          {!isDesktop() && <BottomNavbarMobile />}
          {showFooter && <Footer />}
          <ToastContainer
            position="top-right"
            autoClose={2000}
            transition={Slide}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </SmoothScroll>
      </BrowserRouter>
    </div>
  )
}

export default App
