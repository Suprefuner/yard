import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer, Slide } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
import { getCurrentUser } from "./features/user/userSlice"

function App() {
  const { searchBoxInView } = useSelector((store) => store.general)
  const { isModalOpen } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getCurrentUser())
  }, [])

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
            <Route path="listing/:id" element={<SingleListingPage />} />
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
                  <ChatPage />
                </AuthProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          {!isDesktop() && <BottomNavbarMobile />}
          <Footer />
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
